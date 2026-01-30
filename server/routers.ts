import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { classifyQuestionWithLLM, classifyQuestionsWithLLMBatch } from "./category-classifier";
import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { studyHistory, rankings, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 学習履歴とランキング
  study: router({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const database = await db.getDb();
      if (!database) return null;
      const result = await database.select().from(studyHistory).where(eq(studyHistory.userId, ctx.user.id)).limit(1);
      return result[0] || null;
    }),
    updateHistory: protectedProcedure
      .input(z.object({
        totalTests: z.number(),
        averageScore: z.number(),
        highestScore: z.number(),
        totalQuestionsAnswered: z.number(),
        correctAnswers: z.number(),
        experience: z.number(),
        level: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const database = await db.getDb();
        if (!database) return { success: false };
        
        await database.insert(studyHistory).values({
          userId: ctx.user.id,
          ...input,
        }).onDuplicateKeyUpdate({
          set: input,
        });

        // ランキングも更新（経験値をスコアとする例）
        await database.insert(rankings).values({
          userId: ctx.user.id,
          score: input.experience,
        }).onDuplicateKeyUpdate({
          set: { score: input.experience },
        });

        return { success: true };
      }),
    getRankings: publicProcedure.query(async () => {
      const database = await db.getDb();
      if (!database) return [];
      
      const results = await database
        .select({
          name: users.name,
          score: rankings.score,
          updatedAt: rankings.updatedAt,
        })
        .from(rankings)
        .innerJoin(users, eq(rankings.userId, users.id))
        .orderBy(desc(rankings.score))
        .limit(50);
        
      return results;
    }),
  }),

  // カテゴリ分類機能
  categoryClassifier: router({
    classifyQuestion: publicProcedure
      .input(z.object({
        questionText: z.string().min(1, "問題文は空にできません"),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await classifyQuestionWithLLM(input.questionText);
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "分類に失敗しました",
          };
        }
      }),

    classifyQuestions: publicProcedure
      .input(z.object({
        questions: z.array(z.string().min(1)).min(1, "最低1問必要です"),
        batchSize: z.number().int().positive().default(5),
      }))
      .mutation(async ({ input }) => {
        try {
          const results = await classifyQuestionsWithLLMBatch(
            input.questions,
            input.batchSize
          );
          
          // 統計情報を計算
          const categoryCount = new Map<string, number>();
          let totalConfidence = 0;
          
          results.forEach(r => {
            categoryCount.set(r.category, (categoryCount.get(r.category) || 0) + 1);
            totalConfidence += r.confidence;
          });
          
          const averageConfidence = results.length > 0 ? totalConfidence / results.length : 0;
          
          return {
            success: true,
            data: {
              results,
              statistics: {
                totalProcessed: results.length,
                averageConfidence,
                categoryDistribution: Object.fromEntries(categoryCount),
              },
            },
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "分類に失敗しました",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
