export interface Question {
  id: number;
  text: string;
  answer: boolean; // true = ◯, false = ×
  explanation: string;
  category: string;
}

export const questions: Question[] = [
  // 測定機器（20問）
  {
    id: 1,
    text: "マイクロメータは、ノギスよりも高精度な測定が可能である。",
    answer: true,
    explanation: "マイクロメータは0.01mm単位で測定できるのに対し、ノギスは一般的に0.05mm単位での測定となるため、マイクロメータの方が高精度です。",
    category: "測定機器"
  },
  {
    id: 2,
    text: "ノギスのバーニア目盛りは、本尺の目盛りと同じ間隔である。",
    answer: false,
    explanation: "バーニア目盛りは本尺の目盛りよりわずかに短く作られており、この差を利用して精密な測定を行います。",
    category: "測定機器"
  },
  {
    id: 3,
    text: "ダイヤルゲージは、相対測定に用いられる測定器である。",
    answer: true,
    explanation: "ダイヤルゲージは基準面からの変位量を測定する相対測定器であり、絶対寸法を直接測定することはできません。",
    category: "測定機器"
  },
  {
    id: 4,
    text: "シリンダゲージは、内径の測定に使用される。",
    answer: true,
    explanation: "シリンダゲージは穴の内径を測定するための専用測定器で、ダイヤルゲージと組み合わせて使用します。",
    category: "測定機器"
  },
  {
    id: 5,
    text: "ハイトゲージは、深さの測定には使用できない。",
    answer: false,
    explanation: "ハイトゲージは高さ測定だけでなく、深さや段差の測定にも使用できます。",
    category: "測定機器"
  },
  {
    id: 6,
    text: "デジタルノギスは、アナログノギスよりも読み取り誤差が少ない。",
    answer: true,
    explanation: "デジタルノギスはデジタル表示により読み取り誤差が少なく、視認性も良好です。",
    category: "測定機器"
  },
  {
    id: 7,
    text: "マイクロメータの測定範囲は一般的に25mmである。",
    answer: true,
    explanation: "標準的なマイクロメータの測定範囲は25mmです。より大きな寸法を測定する場合は、複数のマイクロメータを使用します。",
    category: "測定機器"
  },
  {
    id: 8,
    text: "ノギスの最小読取値は0.02mmである。",
    answer: false,
    explanation: "ノギスの最小読取値は一般的に0.05mmです。より精密な測定にはマイクロメータを使用します。",
    category: "測定機器"
  },
  {
    id: 9,
    text: "深さゲージは、穴の深さを測定するために使用される。",
    answer: true,
    explanation: "深さゲージは穴や溝の深さを測定するための専用測定器です。",
    category: "測定機器"
  },
  {
    id: 10,
    text: "ダイヤルゲージの測定値は、針の位置で読み取る。",
    answer: true,
    explanation: "ダイヤルゲージは文字盤上の針の位置により測定値を読み取ります。",
    category: "測定機器"
  },
  {
    id: 11,
    text: "ノギスは、外径と内径の両方の測定に使用できる。",
    answer: true,
    explanation: "ノギスは外側と内側の爪を備えており、外径と内径の両方の測定が可能です。",
    category: "測定機器"
  },
  {
    id: 12,
    text: "マイクロメータの微動ねじは、1回転で0.5mm進む。",
    answer: true,
    explanation: "マイクロメータの微動ねじは1回転で0.5mm進み、これを50等分することで0.01mm単位の測定が可能です。",
    category: "測定機器"
  },
  {
    id: 13,
    text: "ダイヤルゲージの精度は、0.01mmである。",
    answer: true,
    explanation: "一般的なダイヤルゲージの精度は0.01mmで、相対測定に適しています。",
    category: "測定機器"
  },
  {
    id: 14,
    text: "シリンダゲージは、単独で内径を測定できる。",
    answer: false,
    explanation: "シリンダゲージは通常、ダイヤルゲージと組み合わせて使用し、相対測定により内径を測定します。",
    category: "測定機器"
  },
  {
    id: 15,
    text: "ハイトゲージは、垂直方向の寸法測定に使用される。",
    answer: true,
    explanation: "ハイトゲージは基準面からの垂直方向の高さや段差を測定するために使用されます。",
    category: "測定機器"
  },
  {
    id: 16,
    text: "デジタルノギスは、電池で動作する。",
    answer: true,
    explanation: "デジタルノギスは電池を使用して、デジタル表示を行います。",
    category: "測定機器"
  },
  {
    id: 17,
    text: "マイクロメータは、測定前に必ずゼロ調整を行う必要がある。",
    answer: true,
    explanation: "マイクロメータの精度を確保するため、測定前のゼロ調整は必須です。",
    category: "測定機器"
  },
  {
    id: 18,
    text: "ノギスのバーニア目盛りは、10等分されている。",
    answer: true,
    explanation: "一般的なノギスのバーニア目盛りは10等分され、0.05mm単位の読取が可能です。",
    category: "測定機器"
  },
  {
    id: 19,
    text: "深さゲージは、水平方向の測定にも使用できる。",
    answer: false,
    explanation: "深さゲージは垂直方向の深さ測定に特化しており、水平方向の測定には適していません。",
    category: "測定機器"
  },
  {
    id: 20,
    text: "ダイヤルゲージは、回転軸の振れ測定に使用できる。",
    answer: true,
    explanation: "ダイヤルゲージは回転軸の振れやゆがみを測定するのに適しています。",
    category: "測定機器"
  },

  // 硬さ試験（20問）
  {
    id: 21,
    text: "ブリネル硬さ試験では、鋼球圧子を用いる。",
    answer: true,
    explanation: "ブリネル硬さ試験は直径10mmの鋼球を圧子として使用し、硬さを測定します。",
    category: "硬さ試験"
  },
  {
    id: 22,
    text: "ロックウェル硬さ試験は、ブリネル硬さ試験より測定時間が短い。",
    answer: true,
    explanation: "ロックウェル硬さ試験は自動化されており、ブリネル硬さ試験より測定時間が短いです。",
    category: "硬さ試験"
  },
  {
    id: 23,
    text: "ビッカース硬さ試験では、ダイヤモンド圧子を用いる。",
    answer: true,
    explanation: "ビッカース硬さ試験はダイヤモンド製の四角錐圧子を使用し、高精度な硬さ測定が可能です。",
    category: "硬さ試験"
  },
  {
    id: 24,
    text: "ショア硬さ試験は、反発硬さを測定する。",
    answer: true,
    explanation: "ショア硬さ試験はハンマーの反発高さにより硬さを測定する反発硬さ試験です。",
    category: "硬さ試験"
  },
  {
    id: 25,
    text: "ブリネル硬さの記号はHVである。",
    answer: false,
    explanation: "ブリネル硬さの記号はHBです。HVはビッカース硬さの記号です。",
    category: "硬さ試験"
  },
  {
    id: 26,
    text: "ロックウェル硬さには複数のスケールが存在する。",
    answer: true,
    explanation: "ロックウェル硬さはA、B、C、D、E、F、G、H、K、L、M、P、R、S、Vなど複数のスケールがあります。",
    category: "硬さ試験"
  },
  {
    id: 27,
    text: "ビッカース硬さ試験は、薄い材料の硬さ測定に適している。",
    answer: true,
    explanation: "ビッカース硬さ試験は荷重が小さく、薄い材料や表面硬化層の硬さ測定に適しています。",
    category: "硬さ試験"
  },
  {
    id: 28,
    text: "ショア硬さ試験は、接触式の硬さ試験である。",
    answer: false,
    explanation: "ショア硬さ試験は非接触式の反発硬さ試験です。ハンマーが材料に接触して反発します。",
    category: "硬さ試験"
  },
  {
    id: 29,
    text: "マイクロビッカース硬さ試験は、微小領域の硬さ測定に用いられる。",
    answer: true,
    explanation: "マイクロビッカース硬さ試験は非常に小さな荷重を使用し、微小領域の硬さを測定できます。",
    category: "硬さ試験"
  },
  {
    id: 30,
    text: "ブリネル硬さ試験では、測定後に圧痕が残る。",
    answer: true,
    explanation: "ブリネル硬さ試験は破壊的試験であり、測定後に球形の圧痕が材料に残ります。",
    category: "硬さ試験"
  },
  {
    id: 31,
    text: "ロックウェル硬さ試験のスケールCは、最も一般的である。",
    answer: true,
    explanation: "ロックウェル硬さのスケールCは、鋼などの硬い材料の測定に最も一般的に使用されます。",
    category: "硬さ試験"
  },
  {
    id: 32,
    text: "ビッカース硬さは、圧痕の対角線長さから計算される。",
    answer: true,
    explanation: "ビッカース硬さは、四角錐圧子により生じた圧痕の対角線長さから計算されます。",
    category: "硬さ試験"
  },
  {
    id: 33,
    text: "ブリネル硬さ試験は、厚い材料の硬さ測定に適している。",
    answer: true,
    explanation: "ブリネル硬さ試験は大きな荷重を使用するため、厚い材料の硬さ測定に適しています。",
    category: "硬さ試験"
  },
  {
    id: 34,
    text: "ショア硬さ試験は、材料の表面硬さを測定する。",
    answer: true,
    explanation: "ショア硬さ試験は反発硬さにより、材料の表面硬さを測定します。",
    category: "硬さ試験"
  },
  {
    id: 35,
    text: "ロックウェル硬さ試験では、予備荷重と本荷重を使用する。",
    answer: true,
    explanation: "ロックウェル硬さ試験は、予備荷重でゼロ調整し、本荷重で測定を行います。",
    category: "硬さ試験"
  },
  {
    id: 36,
    text: "ビッカース硬さ試験は、非破壊試験である。",
    answer: false,
    explanation: "ビッカース硬さ試験は破壊的試験で、測定後に圧痕が残ります。",
    category: "硬さ試験"
  },
  {
    id: 37,
    text: "ナノインデンテーション試験は、極微小領域の硬さ測定に用いられる。",
    answer: true,
    explanation: "ナノインデンテーション試験は、ナノスケールの領域の硬さを測定する試験です。",
    category: "硬さ試験"
  },
  {
    id: 38,
    text: "硬さ試験の結果は、材料の強度と相関がある。",
    answer: true,
    explanation: "硬さは材料の強度と相関があり、硬さ試験は材料の強度評価に用いられます。",
    category: "硬さ試験"
  },
  {
    id: 39,
    text: "ブリネル硬さの測定値は、荷重と圧痕面積から計算される。",
    answer: true,
    explanation: "ブリネル硬さ = 荷重 ÷ 圧痕面積で計算されます。",
    category: "硬さ試験"
  },
  {
    id: 40,
    text: "硬さ試験は、材料の品質管理に重要な役割を果たす。",
    answer: true,
    explanation: "硬さ試験は、材料の品質確保と品質管理に重要な試験です。",
    category: "硬さ試験"
  },

  // 寸法測定（20問）
  {
    id: 41,
    text: "寸法測定では、測定環境の温度管理が重要である。",
    answer: true,
    explanation: "金属は温度により膨張・収縮するため、精密な寸法測定には温度管理が不可欠です。",
    category: "寸法測定"
  },
  {
    id: 42,
    text: "測定器は、使用前に必ずゼロ調整を行う必要がある。",
    answer: true,
    explanation: "測定器の精度を確保するため、使用前のゼロ調整は必須です。",
    category: "寸法測定"
  },
  {
    id: 43,
    text: "外径測定にはノギスを使用できない。",
    answer: false,
    explanation: "ノギスは外径測定に最も一般的に使用される測定器です。",
    category: "寸法測定"
  },
  {
    id: 44,
    text: "内径測定には、シリンダゲージやボアゲージが使用される。",
    answer: true,
    explanation: "内径測定にはシリンダゲージ、ボアゲージ、内側ノギスなどが使用されます。",
    category: "寸法測定"
  },
  {
    id: 45,
    text: "測定値の記録には、測定日時と測定者名を記載する必要がある。",
    answer: true,
    explanation: "測定記録の信頼性と追跡可能性のため、日時と測定者名の記載は重要です。",
    category: "寸法測定"
  },
  {
    id: 46,
    text: "寸法測定では、複数回測定して平均値を採用することが推奨される。",
    answer: true,
    explanation: "測定誤差を減らすため、複数回測定して平均値を採用することが標準的です。",
    category: "寸法測定"
  },
  {
    id: 47,
    text: "測定器の精度は、定期的な校正により確認される。",
    answer: true,
    explanation: "測定器の精度を維持するため、定期的な校正は必須です。",
    category: "寸法測定"
  },
  {
    id: 48,
    text: "測定値の有効数字は、測定器の精度に応じて決定される。",
    answer: true,
    explanation: "測定器の最小読取値に応じて、測定値の有効数字を適切に設定する必要があります。",
    category: "寸法測定"
  },
  {
    id: 49,
    text: "段差測定には、深さゲージやハイトゲージが使用される。",
    answer: true,
    explanation: "段差測定には深さゲージやハイトゲージが適しています。",
    category: "寸法測定"
  },
  {
    id: 50,
    text: "測定環境の湿度は、寸法測定に影響を与えない。",
    answer: false,
    explanation: "湿度は材料の吸湿による膨張に影響を与えるため、湿度管理も重要です。",
    category: "寸法測定"
  },
  {
    id: 51,
    text: "測定環境の標準温度は、20℃である。",
    answer: true,
    explanation: "精密な寸法測定の標準環境温度は、一般的に20℃に設定されています。",
    category: "寸法測定"
  },
  {
    id: 52,
    text: "測定値の不確かさは、測定器の精度により決定される。",
    answer: true,
    explanation: "測定値の不確かさは、測定器の精度と測定方法により決定されます。",
    category: "寸法測定"
  },
  {
    id: 53,
    text: "内径測定では、基準ゲージを使用して校正する必要がある。",
    answer: true,
    explanation: "内径測定の精度を確保するため、基準ゲージによる校正が必要です。",
    category: "寸法測定"
  },
  {
    id: 54,
    text: "測定器の保管環境は、測定精度に影響を与えない。",
    answer: false,
    explanation: "測定器の保管環境（温度、湿度、振動）は、測定精度に大きく影響します。",
    category: "寸法測定"
  },
  {
    id: 55,
    text: "寸法測定では、測定力（測定圧力）が重要である。",
    answer: true,
    explanation: "測定力が大きすぎると測定対象が変形し、測定精度に影響を与えます。",
    category: "寸法測定"
  },
  {
    id: 56,
    text: "外径測定では、複数の位置で測定することが推奨される。",
    answer: true,
    explanation: "部品の形状誤差を考慮し、複数の位置で測定することが推奨されます。",
    category: "寸法測定"
  },
  {
    id: 57,
    text: "測定値の記録方法は、統一される必要がある。",
    answer: true,
    explanation: "測定記録の信頼性と追跡可能性のため、記録方法の統一は重要です。",
    category: "寸法測定"
  },
  {
    id: 58,
    text: "寸法公差は、測定値と関連している。",
    answer: true,
    explanation: "寸法公差は、測定値がどの程度の範囲で許容されるかを表します。",
    category: "寸法測定"
  },
  {
    id: 59,
    text: "測定器の校正周期は、使用頻度に関わらず一定である。",
    answer: false,
    explanation: "測定器の校正周期は、使用頻度と使用環境に応じて決定されます。",
    category: "寸法測定"
  },
  {
    id: 60,
    text: "測定値の信頼性は、測定者の技術に依存する。",
    answer: true,
    explanation: "測定値の信頼性は、測定器の精度だけでなく、測定者の技術にも依存します。",
    category: "寸法測定"
  },

  // 幾何公差（20問）
  {
    id: 61,
    text: "真直度は、直線の真っすぐさを表す公差である。",
    answer: true,
    explanation: "真直度は、直線がどの程度真っすぐであるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 62,
    text: "平面度は、平面がどの程度平らであるかを表す公差である。",
    answer: true,
    explanation: "平面度は、平面がどの程度平らであるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 63,
    text: "円筒度は、円筒がどの程度正確な円筒であるかを表す公差である。",
    answer: true,
    explanation: "円筒度は、円筒がどの程度正確な円筒形状であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 64,
    text: "垂直度は、2つの直線がどの程度垂直であるかを表す公差である。",
    answer: true,
    explanation: "垂直度は、2つの直線や平面がどの程度垂直であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 65,
    text: "平行度は、2つの直線がどの程度平行であるかを表す公差である。",
    answer: true,
    explanation: "平行度は、2つの直線や平面がどの程度平行であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 66,
    text: "同心度は、2つの円がどの程度同じ中心を持つかを表す公差である。",
    answer: true,
    explanation: "同心度は、2つの円がどの程度同じ中心を持つかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 67,
    text: "対称度は、2つの要素がどの程度対称であるかを表す公差である。",
    answer: true,
    explanation: "対称度は、2つの要素がどの程度対称であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 68,
    text: "位置度は、要素の位置がどの程度正確であるかを表す公差である。",
    answer: true,
    explanation: "位置度は、穴や突起などの要素の位置がどの程度正確であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 69,
    text: "振れ公差は、回転時の振れの大きさを表す公差である。",
    answer: true,
    explanation: "振れ公差は、要素が回転軸を中心に回転するときの振れの大きさを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 70,
    text: "幾何公差は、寸法公差と同時に指定することはできない。",
    answer: false,
    explanation: "幾何公差と寸法公差は同時に指定でき、両者を組み合わせて製品の精度を確保します。",
    category: "幾何公差"
  },
  {
    id: 71,
    text: "円度は、円がどの程度正確な円であるかを表す公差である。",
    answer: true,
    explanation: "円度は、円がどの程度正確な円形であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 72,
    text: "直角度は、2つの直線がどの程度直角であるかを表す公差である。",
    answer: true,
    explanation: "直角度は、2つの直線や平面がどの程度直角であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 73,
    text: "傾斜度は、2つの直線がなす角度の正確さを表す公差である。",
    answer: true,
    explanation: "傾斜度は、2つの直線や平面がなす角度がどの程度正確であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 74,
    text: "全振れ公差は、回転軸に対する全体的な振れを表す公差である。",
    answer: true,
    explanation: "全振れ公差は、回転軸に対する要素全体の振れを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 75,
    text: "幾何公差は、図面上で記号で表示される。",
    answer: true,
    explanation: "幾何公差は、図面上で特定の記号で表示されます。",
    category: "幾何公差"
  },
  {
    id: 76,
    text: "基準面は、幾何公差の測定に重要である。",
    answer: true,
    explanation: "基準面は、幾何公差の測定の基準となる重要な要素です。",
    category: "幾何公差"
  },
  {
    id: 77,
    text: "幾何公差の値は、常に正の値である。",
    answer: true,
    explanation: "幾何公差の値は、常に正の値で表示されます。",
    category: "幾何公差"
  },
  {
    id: 78,
    text: "幾何公差は、製品の機能に重要な影響を与える。",
    answer: true,
    explanation: "幾何公差は、製品の機能、組立性、耐久性に重要な影響を与えます。",
    category: "幾何公差"
  },
  {
    id: 79,
    text: "幾何公差の測定には、専用の測定器が必要である。",
    answer: true,
    explanation: "幾何公差の測定には、角度ゲージやダイヤルゲージなどの専用測定器が必要です。",
    category: "幾何公差"
  },
  {
    id: 80,
    text: "幾何公差は、JISで規定されている。",
    answer: true,
    explanation: "幾何公差はJIS B 0401で規定されています。",
    category: "幾何公差"
  },

  // 表面性状（20問）
  {
    id: 81,
    text: "表面粗さは、表面の凹凸の大きさを表す。",
    answer: true,
    explanation: "表面粗さは、表面の微細な凹凸の大きさを表す指標です。",
    category: "表面性状"
  },
  {
    id: 82,
    text: "表面粗さの記号Raは、算術平均粗さを表す。",
    answer: true,
    explanation: "Raは算術平均粗さ（中心線平均粗さ）を表す最も一般的な表面粗さの指標です。",
    category: "表面性状"
  },
  {
    id: 83,
    text: "表面粗さの記号Rzは、最大高さを表す。",
    answer: true,
    explanation: "Rzは最大高さ粗さを表し、最も高い山と最も深い谷の差です。",
    category: "表面性状"
  },
  {
    id: 84,
    text: "表面粗さは、加工方法により異なる。",
    answer: true,
    explanation: "旋盤加工、フライス加工、研磨など、加工方法により表面粗さは大きく異なります。",
    category: "表面性状"
  },
  {
    id: 85,
    text: "表面粗さの測定には、触針式粗さ計が最も一般的である。",
    answer: true,
    explanation: "触針式粗さ計は、針を表面に接触させて粗さを測定する最も一般的な測定器です。",
    category: "表面性状"
  },
  {
    id: 86,
    text: "表面粗さの単位はμmである。",
    answer: true,
    explanation: "表面粗さの単位は一般的にμm（マイクロメートル）です。",
    category: "表面性状"
  },
  {
    id: 87,
    text: "非接触式粗さ計は、触針式粗さ計より測定精度が高い。",
    answer: false,
    explanation: "触針式粗さ計の方が測定精度が高く、より広く使用されています。",
    category: "表面性状"
  },
  {
    id: 88,
    text: "表面粗さは、製品の機能に影響を与えない。",
    answer: false,
    explanation: "表面粗さは摩擦、耐久性、密閉性など、製品の機能に大きく影響します。",
    category: "表面性状"
  },
  {
    id: 89,
    text: "研磨加工により、表面粗さを大幅に改善できる。",
    answer: true,
    explanation: "研磨加工は表面粗さを大幅に改善でき、高精度な表面仕上げが可能です。",
    category: "表面性状"
  },
  {
    id: 90,
    text: "表面粗さの測定値は、測定方向に影響を受ける。",
    answer: true,
    explanation: "表面粗さは加工の方向性により異なるため、測定方向は重要です。",
    category: "表面性状"
  },
  {
    id: 91,
    text: "表面粗さの記号Ryは、最大高さを表す。",
    answer: false,
    explanation: "Ryは最大高さ粗さですが、Rzと同じ意味で使用されることもあります。一般的にはRzが使用されます。",
    category: "表面性状"
  },
  {
    id: 92,
    text: "表面粗さは、材料の種類に関わらず同じである。",
    answer: false,
    explanation: "表面粗さは、材料の種類と加工方法により異なります。",
    category: "表面性状"
  },
  {
    id: 93,
    text: "触針式粗さ計の測定値は、測定長に影響を受ける。",
    answer: true,
    explanation: "触針式粗さ計の測定値は、測定長（カットオフ値）により影響を受けます。",
    category: "表面性状"
  },
  {
    id: 94,
    text: "表面粗さの基準線は、測定値の平均値である。",
    answer: true,
    explanation: "表面粗さの基準線は、測定値の算術平均値です。",
    category: "表面性状"
  },
  {
    id: 95,
    text: "表面粗さは、図面上で記号で表示される。",
    answer: true,
    explanation: "表面粗さは、図面上で特定の記号で表示されます。",
    category: "表面性状"
  },
  {
    id: 96,
    text: "旋盤加工の表面粗さは、フライス加工より小さい。",
    answer: false,
    explanation: "旋盤加工とフライス加工の表面粗さは、加工条件により異なります。",
    category: "表面性状"
  },
  {
    id: 97,
    text: "表面粗さの測定には、複数回測定することが推奨される。",
    answer: true,
    explanation: "測定誤差を減らすため、複数回測定して平均値を採用することが推奨されます。",
    category: "表面性状"
  },
  {
    id: 98,
    text: "表面粗さは、材料の強度と相関がある。",
    answer: false,
    explanation: "表面粗さと材料の強度には直接的な相関はありませんが、耐久性には影響を与えます。",
    category: "表面性状"
  },
  {
    id: 99,
    text: "粗さ計は、定期的な校正が必要である。",
    answer: true,
    explanation: "粗さ計の精度を確保するため、定期的な校正は必須です。",
    category: "表面性状"
  },
  {
    id: 100,
    text: "表面粗さは、製品の美観に影響を与える。",
    answer: true,
    explanation: "表面粗さは、製品の美観と高級感に影響を与えます。",
    category: "表面性状"
  },

  // ねじ測定（20問）
  {
    id: 101,
    text: "ねじの有効径は、ねじの外径と内径の平均である。",
    answer: true,
    explanation: "ねじの有効径（ピッチ径）は、外径と内径の中点にあります。",
    category: "ねじ測定"
  },
  {
    id: 102,
    text: "ねじゲージは、ねじの寸法を測定するために使用される。",
    answer: true,
    explanation: "ねじゲージはねじの有効径やピッチを測定する専用測定器です。",
    category: "ねじ測定"
  },
  {
    id: 103,
    text: "ねじのピッチは、隣同士の山の間隔である。",
    answer: true,
    explanation: "ねじのピッチは、隣同士の山（または谷）の間隔を表します。",
    category: "ねじ測定"
  },
  {
    id: 104,
    text: "マイクロメータを使用してねじの有効径を直接測定できる。",
    answer: false,
    explanation: "ねじの有効径は直接測定できず、ねじゲージや3本ワイヤ法などの方法を使用します。",
    category: "ねじ測定"
  },
  {
    id: 105,
    text: "3本ワイヤ法は、ねじの有効径を測定する方法である。",
    answer: true,
    explanation: "3本ワイヤ法は、3本の同じ直径のワイヤを使用してねじの有効径を測定する方法です。",
    category: "ねじ測定"
  },
  {
    id: 106,
    text: "ねじゲージは、ねじの合否を判定するために使用される。",
    answer: true,
    explanation: "ねじゲージはGO/NOGOゲージとして、ねじの合否判定に使用されます。",
    category: "ねじ測定"
  },
  {
    id: 107,
    text: "メートルねじとインチねじは、ピッチが異なる。",
    answer: true,
    explanation: "メートルねじはmmで、インチねじはインチで表示され、ピッチが異なります。",
    category: "ねじ測定"
  },
  {
    id: 108,
    text: "ねじの外径は、ねじの最も大きい直径である。",
    answer: true,
    explanation: "ねじの外径は、ねじの最も大きい直径で、呼び径とも呼ばれます。",
    category: "ねじ測定"
  },
  {
    id: 109,
    text: "ねじの内径は、ねじの最も小さい直径である。",
    answer: true,
    explanation: "ねじの内径は、ねじの最も小さい直径で、谷の直径です。",
    category: "ねじ測定"
  },
  {
    id: 110,
    text: "ねじの精度等級は、JISで規定されている。",
    answer: true,
    explanation: "ねじの精度等級はJISで規定され、複数の等級があります。",
    category: "ねじ測定"
  },
  {
    id: 111,
    text: "ねじのリード角は、ねじのピッチと直径から計算される。",
    answer: true,
    explanation: "ねじのリード角は、ピッチと直径の関係から計算されます。",
    category: "ねじ測定"
  },
  {
    id: 112,
    text: "ねじの山の角度は、一般的に60°である。",
    answer: true,
    explanation: "メートルねじの山の角度は、一般的に60°です。",
    category: "ねじ測定"
  },
  {
    id: 113,
    text: "ねじゲージの測定精度は、マイクロメータより高い。",
    answer: true,
    explanation: "ねじゲージは専用測定器であり、ねじ測定の精度はマイクロメータより高いです。",
    category: "ねじ測定"
  },
  {
    id: 114,
    text: "ねじの有効径は、ねじの機能に重要である。",
    answer: true,
    explanation: "ねじの有効径は、ねじの強度と機能に重要な影響を与えます。",
    category: "ねじ測定"
  },
  {
    id: 115,
    text: "ねじの公差は、寸法公差と幾何公差を含む。",
    answer: true,
    explanation: "ねじの公差は、寸法公差（有効径、ピッチ）と幾何公差を含みます。",
    category: "ねじ測定"
  },
  {
    id: 116,
    text: "ねじのピッチは、1回転当たりの進み量である。",
    answer: true,
    explanation: "ねじのピッチは、1回転当たりの進み量を表します。",
    category: "ねじ測定"
  },
  {
    id: 117,
    text: "ねじゲージは、破壊的試験である。",
    answer: false,
    explanation: "ねじゲージは非破壊的な測定方法で、ねじを破壊しません。",
    category: "ねじ測定"
  },
  {
    id: 118,
    text: "ねじの測定には、複数の測定方法がある。",
    answer: true,
    explanation: "ねじ測定には、ねじゲージ、3本ワイヤ法、投影機など複数の方法があります。",
    category: "ねじ測定"
  },
  {
    id: 119,
    text: "ねじの精度は、組立性に影響を与える。",
    answer: true,
    explanation: "ねじの精度が低いと、組立が困難になり、機能に影響を与えます。",
    category: "ねじ測定"
  },
  {
    id: 120,
    text: "ねじの測定は、品質管理に重要である。",
    answer: true,
    explanation: "ねじの測定は、製品の品質確保と品質管理に重要な役割を果たします。",
    category: "ねじ測定"
  },

  // 歯車測定（20問）
  {
    id: 121,
    text: "歯車のモジュールは、歯の大きさを表す。",
    answer: true,
    explanation: "モジュールは歯の大きさを表す指標で、モジュール値が大きいほど歯が大きいです。",
    category: "歯車測定"
  },
  {
    id: 122,
    text: "歯車の歯数は、歯車の回転速度に影響を与える。",
    answer: true,
    explanation: "歯数が多いほど回転速度は遅くなり、トルクは大きくなります。",
    category: "歯車測定"
  },
  {
    id: 123,
    text: "歯車のピッチ円直径は、モジュール×歯数で計算される。",
    answer: true,
    explanation: "ピッチ円直径 = モジュール × 歯数で計算されます。",
    category: "歯車測定"
  },
  {
    id: 124,
    text: "歯車の圧力角は、歯の形状に影響を与える。",
    answer: true,
    explanation: "圧力角は歯の形状を決定する重要なパラメータです。",
    category: "歯車測定"
  },
  {
    id: 125,
    text: "歯車の歯厚は、マイクロメータで直接測定できる。",
    answer: false,
    explanation: "歯厚は複雑な形状のため、専用の歯厚測定器や計算により測定します。",
    category: "歯車測定"
  },
  {
    id: 126,
    text: "歯車の振れは、回転時の振動に影響を与える。",
    answer: true,
    explanation: "歯車の振れが大きいと、回転時に振動が生じます。",
    category: "歯車測定"
  },
  {
    id: 127,
    text: "歯車の歯面粗さは、騒音と摩耗に影響を与える。",
    answer: true,
    explanation: "歯面粗さが大きいと、騒音が増加し、摩耗も進みやすくなります。",
    category: "歯車測定"
  },
  {
    id: 128,
    text: "歯車のバックラッシは、歯車間の隙間である。",
    answer: true,
    explanation: "バックラッシは、かみ合う2つの歯車間の隙間を表します。",
    category: "歯車測定"
  },
  {
    id: 129,
    text: "歯車の精度等級は、JISで規定されている。",
    answer: true,
    explanation: "歯車の精度等級はJISで規定され、複数の等級があります。",
    category: "歯車測定"
  },
  {
    id: 130,
    text: "歯車の材料は、鋼が最も一般的である。",
    answer: true,
    explanation: "歯車の材料として、鋼が最も一般的に使用されています。",
    category: "歯車測定"
  },
  {
    id: 131,
    text: "歯車の外径は、モジュールと歯数から計算される。",
    answer: true,
    explanation: "歯車の外径は、ピッチ円直径にモジュールを加えて計算されます。",
    category: "歯車測定"
  },
  {
    id: 132,
    text: "歯車の内径は、ピッチ円直径からモジュール×2.5を引いて計算される。",
    answer: true,
    explanation: "歯車の内径（根元円直径）は、ピッチ円直径からモジュール×2.5を引いて計算されます。",
    category: "歯車測定"
  },
  {
    id: 133,
    text: "歯車の圧力角は、一般的に20°である。",
    answer: true,
    explanation: "歯車の圧力角は、一般的に20°です。",
    category: "歯車測定"
  },
  {
    id: 134,
    text: "歯車の歯数は、歯車の強度に影響を与える。",
    answer: true,
    explanation: "歯数が少ないと、1本の歯にかかる荷重が大きくなり、強度に影響を与えます。",
    category: "歯車測定"
  },
  {
    id: 135,
    text: "歯車のモジュールは、JISで規定されている。",
    answer: true,
    explanation: "歯車のモジュールはJISで規定された標準値があります。",
    category: "歯車測定"
  },
  {
    id: 136,
    text: "歯車の測定には、投影機が使用される。",
    answer: true,
    explanation: "歯車の測定には、投影機が使用されることがあります。",
    category: "歯車測定"
  },
  {
    id: 137,
    text: "歯車の精度は、騒音に影響を与える。",
    answer: true,
    explanation: "歯車の精度が低いと、騒音が増加します。",
    category: "歯車測定"
  },
  {
    id: 138,
    text: "歯車の歯面は、一般的に研磨加工される。",
    answer: true,
    explanation: "高精度な歯車の歯面は、研磨加工により仕上げられます。",
    category: "歯車測定"
  },
  {
    id: 139,
    text: "歯車のバックラッシは、製品の機能に重要である。",
    answer: true,
    explanation: "バックラッシは、歯車の遊びを調整し、製品の機能に重要な影響を与えます。",
    category: "歯車測定"
  },
  {
    id: 140,
    text: "歯車の測定は、品質管理に重要である。",
    answer: true,
    explanation: "歯車の測定は、製品の品質確保と品質管理に重要な役割を果たします。",
    category: "歯車測定"
  },

  // 角度測定（20問）
  {
    id: 141,
    text: "角度ゲージは、角度を測定するために使用される。",
    answer: true,
    explanation: "角度ゲージは、2つの直線がなす角度を測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 142,
    text: "分度器は、精密な角度測定に適している。",
    answer: false,
    explanation: "分度器は簡易的な測定器で、精密な角度測定には角度ゲージを使用します。",
    category: "角度測定"
  },
  {
    id: 143,
    text: "デジタル角度ゲージは、アナログ角度ゲージより読み取り誤差が少ない。",
    answer: true,
    explanation: "デジタル角度ゲージはデジタル表示により、読み取り誤差が少なくなります。",
    category: "角度測定"
  },
  {
    id: 144,
    text: "傾斜計は、水平面からの傾斜角を測定する。",
    answer: true,
    explanation: "傾斜計は、水平面からの傾斜角を測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 145,
    text: "角度の単位は、度（°）とラジアン（rad）がある。",
    answer: true,
    explanation: "角度の単位として、度（°）とラジアン（rad）が使用されます。",
    category: "角度測定"
  },
  {
    id: 146,
    text: "正弦定規は、小さな角度を測定するために使用される。",
    answer: true,
    explanation: "正弦定規は、小さな角度を高精度で測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 147,
    text: "角度測定では、基準面の平面度が重要である。",
    answer: true,
    explanation: "角度測定の精度は、基準面の平面度に大きく影響します。",
    category: "角度測定"
  },
  {
    id: 148,
    text: "ベベルプロトラクタは、複雑な角度を測定できる。",
    answer: true,
    explanation: "ベベルプロトラクタは、複雑な角度を測定できる精密な角度測定器です。",
    category: "角度測定"
  },
  {
    id: 149,
    text: "角度ゲージは、直線の垂直度測定に使用できる。",
    answer: true,
    explanation: "角度ゲージは、垂直度や平行度などの角度関連の測定に使用できます。",
    category: "角度測定"
  },
  {
    id: 150,
    text: "角度の測定値は、温度に影響を受けない。",
    answer: false,
    explanation: "角度測定器も金属製のため、温度により膨張・収縮し、測定値に影響を与えます。",
    category: "角度測定"
  },
  {
    id: 151,
    text: "角度ゲージの精度は、0.1°である。",
    answer: true,
    explanation: "一般的な角度ゲージの精度は、0.1°です。",
    category: "角度測定"
  },
  {
    id: 152,
    text: "傾斜計は、デジタル表示が可能である。",
    answer: true,
    explanation: "デジタル傾斜計は、デジタル表示により角度を表示します。",
    category: "角度測定"
  },
  {
    id: 153,
    text: "正弦定規は、ブロックゲージと組み合わせて使用される。",
    answer: true,
    explanation: "正弦定規は、ブロックゲージと組み合わせて、正確な角度を作ります。",
    category: "角度測定"
  },
  {
    id: 154,
    text: "角度ゲージは、校正が必要である。",
    answer: true,
    explanation: "角度ゲージの精度を確保するため、定期的な校正が必要です。",
    category: "角度測定"
  },
  {
    id: 155,
    text: "角度測定では、複数回測定することが推奨される。",
    answer: true,
    explanation: "測定誤差を減らすため、複数回測定して平均値を採用することが推奨されます。",
    category: "角度測定"
  },
  {
    id: 156,
    text: "ベベルプロトラクタの精度は、1°である。",
    answer: true,
    explanation: "一般的なベベルプロトラクタの精度は、1°です。",
    category: "角度測定"
  },
  {
    id: 157,
    text: "角度ゲージは、垂直度と平行度の測定に使用できる。",
    answer: true,
    explanation: "角度ゲージは、垂直度、平行度、傾斜度などの測定に使用できます。",
    category: "角度測定"
  },
  {
    id: 158,
    text: "傾斜計は、重力を利用して角度を測定する。",
    answer: true,
    explanation: "傾斜計は、重力の作用を利用して、傾斜角を測定します。",
    category: "角度測定"
  },
  {
    id: 159,
    text: "角度測定の基準面は、平面である必要がある。",
    answer: true,
    explanation: "角度測定の基準面は、平面度が高い必要があります。",
    category: "角度測定"
  },
  {
    id: 160,
    text: "角度測定は、品質管理に重要である。",
    answer: true,
    explanation: "角度測定は、製品の品質確保と品質管理に重要な役割を果たします。",
    category: "角度測定"
  },

  // 光学測定（20問）
  {
    id: 161,
    text: "光学測定は、非接触式の測定方法である。",
    answer: true,
    explanation: "光学測定は光を使用した非接触式の測定方法です。",
    category: "光学測定"
  },
  {
    id: 162,
    text: "投影機は、小さな部品の寸法測定に適している。",
    answer: true,
    explanation: "投影機は、部品を拡大投影して寸法を測定するため、小さな部品の測定に適しています。",
    category: "光学測定"
  },
  {
    id: 163,
    text: "レーザー測定器は、長距離の測定に適している。",
    answer: true,
    explanation: "レーザー測定器は、長距離の測定に適した非接触式測定器です。",
    category: "光学測定"
  },
  {
    id: 164,
    text: "光学測定では、光源の安定性が重要である。",
    answer: true,
    explanation: "光学測定の精度は、光源の安定性に大きく影響します。",
    category: "光学測定"
  },
  {
    id: 165,
    text: "CCD測定器は、画像処理により寸法を測定する。",
    answer: true,
    explanation: "CCD測定器は、CCDカメラで撮影した画像を処理して寸法を測定します。",
    category: "光学測定"
  },
  {
    id: 166,
    text: "光学測定は、表面が鏡面でない場合は使用できない。",
    answer: false,
    explanation: "光学測定は、表面の状態に関わらず使用できます。",
    category: "光学測定"
  },
  {
    id: 167,
    text: "投影機の倍率は、調整可能である。",
    answer: true,
    explanation: "投影機の倍率は、対物レンズの交換により調整できます。",
    category: "光学測定"
  },
  {
    id: 168,
    text: "レーザー測定器は、透明な材料の測定に適している。",
    answer: true,
    explanation: "レーザー測定器は、透明な材料の測定にも適しています。",
    category: "光学測定"
  },
  {
    id: 169,
    text: "光学測定では、キャリブレーションが必要である。",
    answer: true,
    explanation: "光学測定器の精度を確保するため、定期的なキャリブレーションが必要です。",
    category: "光学測定"
  },
  {
    id: 170,
    text: "画像測定機は、複雑な形状の寸法測定に適している。",
    answer: true,
    explanation: "画像測定機は、複雑な形状の部品の寸法を正確に測定できます。",
    category: "光学測定"
  },
  {
    id: 171,
    text: "投影機の精度は、0.01mmである。",
    answer: true,
    explanation: "一般的な投影機の精度は、0.01mm程度です。",
    category: "光学測定"
  },
  {
    id: 172,
    text: "光学測定は、環境光の影響を受ける。",
    answer: true,
    explanation: "光学測定は、環境光の影響を受けるため、暗い環境での測定が推奨されます。",
    category: "光学測定"
  },
  {
    id: 173,
    text: "レーザー測定器は、反射面を必要とする。",
    answer: true,
    explanation: "レーザー測定器は、測定対象からのレーザー反射を利用して測定します。",
    category: "光学測定"
  },
  {
    id: 174,
    text: "画像測定機は、自動測定が可能である。",
    answer: true,
    explanation: "画像測定機は、プログラムにより自動測定が可能です。",
    category: "光学測定"
  },
  {
    id: 175,
    text: "光学測定は、高精度な寸法測定に適している。",
    answer: true,
    explanation: "光学測定は、非接触式で高精度な寸法測定が可能です。",
    category: "光学測定"
  },
  {
    id: 176,
    text: "投影機は、輪郭測定に使用できる。",
    answer: true,
    explanation: "投影機は、部品の輪郭を投影して、輪郭測定に使用できます。",
    category: "光学測定"
  },
  {
    id: 177,
    text: "光学測定では、複数回測定することが推奨される。",
    answer: true,
    explanation: "測定誤差を減らすため、複数回測定して平均値を採用することが推奨されます。",
    category: "光学測定"
  },
  {
    id: 178,
    text: "レーザー測定器は、移動距離の測定に使用できる。",
    answer: true,
    explanation: "レーザー測定器は、移動距離や変位の測定に使用できます。",
    category: "光学測定"
  },
  {
    id: 179,
    text: "光学測定は、品質管理に重要である。",
    answer: true,
    explanation: "光学測定は、製品の品質確保と品質管理に重要な役割を果たします。",
    category: "光学測定"
  },
  {
    id: 180,
    text: "画像測定機は、複数の部品を同時に測定できる。",
    answer: true,
    explanation: "画像測定機は、複数の部品を同時に測定することが可能です。",
    category: "光学測定"
  },

  // 材料試験（20問）
  {
    id: 181,
    text: "引張試験は、材料の強度を測定する試験である。",
    answer: true,
    explanation: "引張試験は、材料に引張力を加えて強度や伸びを測定する試験です。",
    category: "材料試験"
  },
  {
    id: 182,
    text: "圧縮試験は、材料の圧縮強度を測定する試験である。",
    answer: true,
    explanation: "圧縮試験は、材料に圧縮力を加えて圧縮強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 183,
    text: "曲げ試験は、材料の曲げ強度を測定する試験である。",
    answer: true,
    explanation: "曲げ試験は、材料に曲げ力を加えて曲げ強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 184,
    text: "衝撃試験は、材料の衝撃耐性を測定する試験である。",
    answer: true,
    explanation: "衝撃試験は、材料に衝撃を与えて衝撃耐性を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 185,
    text: "疲労試験は、材料の疲労強度を測定する試験である。",
    answer: true,
    explanation: "疲労試験は、材料に繰り返し応力を加えて疲労強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 186,
    text: "引張試験では、材料の降伏点と引張強度が測定される。",
    answer: true,
    explanation: "引張試験により、降伏点、引張強度、伸びなどが測定されます。",
    category: "材料試験"
  },
  {
    id: 187,
    text: "材料試験は、破壊的試験である。",
    answer: true,
    explanation: "材料試験は、試験片を破壊させるため、破壊的試験です。",
    category: "材料試験"
  },
  {
    id: 188,
    text: "引張試験の試験速度は、試験結果に影響を与えない。",
    answer: false,
    explanation: "試験速度は試験結果に影響を与えるため、JISで規定されています。",
    category: "材料試験"
  },
  {
    id: 189,
    text: "材料試験の試験片は、JISで規定されている。",
    answer: true,
    explanation: "材料試験の試験片の形状・寸法はJISで規定されています。",
    category: "材料試験"
  },
  {
    id: 190,
    text: "高温材料試験では、試験温度の管理が重要である。",
    answer: true,
    explanation: "高温材料試験では、試験温度を正確に管理することが重要です。",
    category: "材料試験"
  },
  {
    id: 191,
    text: "引張試験の応力-ひずみ曲線は、材料の特性を表す。",
    answer: true,
    explanation: "応力-ひずみ曲線は、材料の強度、延性、靭性などの特性を表します。",
    category: "材料試験"
  },
  {
    id: 192,
    text: "衝撃試験には、シャルピー試験とアイゾッド試験がある。",
    answer: true,
    explanation: "衝撃試験には、シャルピー試験とアイゾッド試験の2種類があります。",
    category: "材料試験"
  },
  {
    id: 193,
    text: "疲労試験では、応力の繰り返し回数が測定される。",
    answer: true,
    explanation: "疲労試験では、破断するまでの応力繰り返し回数が測定されます。",
    category: "材料試験"
  },
  {
    id: 194,
    text: "材料試験の結果は、材料の品質確保に重要である。",
    answer: true,
    explanation: "材料試験の結果は、材料の品質確保と品質管理に重要な役割を果たします。",
    category: "材料試験"
  },
  {
    id: 195,
    text: "低温材料試験では、材料の脆性が増加する。",
    answer: true,
    explanation: "低温では、材料の脆性が増加し、延性が低下します。",
    category: "材料試験"
  },
  {
    id: 196,
    text: "引張試験では、試験片の伸びが測定される。",
    answer: true,
    explanation: "引張試験により、試験片の伸び（延性）が測定されます。",
    category: "材料試験"
  },
  {
    id: 197,
    text: "曲げ試験は、脆性材料の強度測定に適している。",
    answer: true,
    explanation: "曲げ試験は、脆性材料の強度測定に適しています。",
    category: "材料試験"
  },
  {
    id: 198,
    text: "材料試験は、製品設計に重要な情報を提供する。",
    answer: true,
    explanation: "材料試験の結果は、製品設計に重要な情報を提供します。",
    category: "材料試験"
  },
  {
    id: 199,
    text: "衝撃試験の結果は、材料の靭性を表す。",
    answer: true,
    explanation: "衝撃試験の結果は、材料の衝撃に対する耐性（靭性）を表します。",
    category: "材料試験"
  },
  {
    id: 200,
    text: "疲労試験は、長期使用される部品の評価に重要である。",
    answer: true,
    explanation: "疲労試験は、繰り返し応力を受ける部品の評価に重要です。",
    category: "材料試験"
  },

  // 非破壊検査（20問）
  {
    id: 201,
    text: "超音波探傷検査は、非破壊検査の一種である。",
    answer: true,
    explanation: "超音波探傷検査は、超音波を使用して材料内部の欠陥を検出する非破壊検査です。",
    category: "非破壊検査"
  },
  {
    id: 202,
    text: "磁粉探傷検査は、磁性材料の表面欠陥を検出する。",
    answer: true,
    explanation: "磁粉探傷検査は、磁性材料の表面欠陥を磁粉で可視化して検出します。",
    category: "非破壊検査"
  },
  {
    id: 203,
    text: "浸透探傷検査は、非磁性材料の表面欠陥を検出する。",
    answer: true,
    explanation: "浸透探傷検査は、非磁性材料の表面欠陥を浸透液で検出します。",
    category: "非破壊検査"
  },
  {
    id: 204,
    text: "渦電流探傷検査は、導電性材料の欠陥を検出する。",
    answer: true,
    explanation: "渦電流探傷検査は、渦電流を使用して導電性材料の欠陥を検出します。",
    category: "非破壊検査"
  },
  {
    id: 205,
    text: "放射線透過検査は、材料内部の欠陥を検出する。",
    answer: true,
    explanation: "放射線透過検査は、X線やγ線を使用して材料内部の欠陥を検出します。",
    category: "非破壊検査"
  },
  {
    id: 206,
    text: "超音波探傷検査では、超音波の反射を利用する。",
    answer: true,
    explanation: "超音波探傷検査は、超音波の反射波を検出して欠陥を判定します。",
    category: "非破壊検査"
  },
  {
    id: 207,
    text: "非破壊検査は、製品の品質確保に重要である。",
    answer: true,
    explanation: "非破壊検査により、製品の内部欠陥を検出し、品質を確保します。",
    category: "非破壊検査"
  },
  {
    id: 208,
    text: "磁粉探傷検査は、非磁性材料にも適用できる。",
    answer: false,
    explanation: "磁粉探傷検査は磁性材料のみに適用でき、非磁性材料には浸透探傷検査を使用します。",
    category: "非破壊検査"
  },
  {
    id: 209,
    text: "渦電流探傷検査は、表面欠陥の検出に適している。",
    answer: true,
    explanation: "渦電流探傷検査は、表面から数mm程度の欠陥検出に適しています。",
    category: "非破壊検査"
  },
  {
    id: 210,
    text: "非破壊検査の検査員は、資格を取得する必要がある。",
    answer: true,
    explanation: "非破壊検査の検査員は、JISで規定された資格を取得する必要があります。",
    category: "非破壊検査"
  },
  {
    id: 211,
    text: "超音波探傷検査は、厚い材料の検査に適している。",
    answer: true,
    explanation: "超音波探傷検査は、厚い材料の内部欠陥検査に適しています。",
    category: "非破壊検査"
  },
  {
    id: 212,
    text: "浸透探傷検査は、複雑な形状の検査に適している。",
    answer: true,
    explanation: "浸透探傷検査は、複雑な形状の部品の表面欠陥検査に適しています。",
    category: "非破壊検査"
  },
  {
    id: 213,
    text: "放射線透過検査は、溶接部の欠陥検査に使用される。",
    answer: true,
    explanation: "放射線透過検査は、溶接部の内部欠陥検査に広く使用されます。",
    category: "非破壊検査"
  },
  {
    id: 214,
    text: "渦電流探傷検査は、非導電性材料の検査に適している。",
    answer: false,
    explanation: "渦電流探傷検査は導電性材料のみに適用でき、非導電性材料には適していません。",
    category: "非破壊検査"
  },
  {
    id: 215,
    text: "非破壊検査は、製品の機能性に影響を与えない。",
    answer: true,
    explanation: "非破壊検査は、製品を破壊しないため、機能性に影響を与えません。",
    category: "非破壊検査"
  },
  {
    id: 216,
    text: "超音波探傷検査では、探触子が使用される。",
    answer: true,
    explanation: "超音波探傷検査では、超音波を発生・受信する探触子が使用されます。",
    category: "非破壊検査"
  },
  {
    id: 217,
    text: "磁粉探傷検査では、磁化が必要である。",
    answer: true,
    explanation: "磁粉探傷検査では、検査対象を磁化して、欠陥を検出します。",
    category: "非破壊検査"
  },
  {
    id: 218,
    text: "浸透探傷検査は、コストが低い検査方法である。",
    answer: true,
    explanation: "浸透探傷検査は、比較的低コストで実施できる検査方法です。",
    category: "非破壊検査"
  },
  {
    id: 219,
    text: "非破壊検査は、品質管理に重要である。",
    answer: true,
    explanation: "非破壊検査は、製品の品質確保と品質管理に重要な役割を果たします。",
    category: "非破壊検査"
  },
  {
    id: 220,
    text: "放射線透過検査は、安全管理が重要である。",
    answer: true,
    explanation: "放射線透過検査では、放射線の安全管理が重要です。",
    category: "非破壊検査"
  },

  // 品質管理（20問）
  {
    id: 221,
    text: "品質管理は、製品の品質を確保するための活動である。",
    answer: true,
    explanation: "品質管理は、製品が要求される品質を満たすようにするための活動です。",
    category: "品質管理"
  },
  {
    id: 222,
    text: "統計的品質管理は、統計手法を使用した品質管理である。",
    answer: true,
    explanation: "統計的品質管理は、統計手法を使用して品質を管理する方法です。",
    category: "品質管理"
  },
  {
    id: 223,
    text: "管理図は、プロセスの安定性を監視するために使用される。",
    answer: true,
    explanation: "管理図は、プロセスが統計的に管理状態にあるかを監視します。",
    category: "品質管理"
  },
  {
    id: 224,
    text: "抜取検査は、全数検査より効率的である。",
    answer: true,
    explanation: "抜取検査は、全数検査より検査時間と費用が少なくて済みます。",
    category: "品質管理"
  },
  {
    id: 225,
    text: "AQL（許容品質水準）は、抜取検査の合格基準である。",
    answer: true,
    explanation: "AQLは、抜取検査で合格と判定するための許容品質水準です。",
    category: "品質管理"
  },
  {
    id: 226,
    text: "ロットは、同じ条件で製造された製品の集合である。",
    answer: true,
    explanation: "ロットは、同じ条件で製造された製品の単位です。",
    category: "品質管理"
  },
  {
    id: 227,
    text: "不良率は、不良品の数を全製品数で割った値である。",
    answer: true,
    explanation: "不良率 = 不良品数 ÷ 全製品数で計算されます。",
    category: "品質管理"
  },
  {
    id: 228,
    text: "品質管理は、製造部門だけの責任である。",
    answer: false,
    explanation: "品質管理は、企業全体の活動であり、全部門の協力が必要です。",
    category: "品質管理"
  },
  {
    id: 229,
    text: "工程能力指数は、プロセスの能力を表す指標である。",
    answer: true,
    explanation: "工程能力指数（Cp、Cpk）は、プロセスが要求を満たす能力を表します。",
    category: "品質管理"
  },
  {
    id: 230,
    text: "品質改善は、継続的な活動である。",
    answer: true,
    explanation: "品質改善は、一度の改善ではなく、継続的に行う必要があります。",
    category: "品質管理"
  },
  {
    id: 231,
    text: "管理図の管理限界は、統計的に計算される。",
    answer: true,
    explanation: "管理図の管理限界は、統計手法により計算されます。",
    category: "品質管理"
  },
  {
    id: 232,
    text: "抜取検査では、サンプルサイズが重要である。",
    answer: true,
    explanation: "抜取検査の精度は、サンプルサイズに大きく影響します。",
    category: "品質管理"
  },
  {
    id: 233,
    text: "品質コストは、製品の価格に影響を与える。",
    answer: true,
    explanation: "品質管理に要するコストは、製品の価格に影響を与えます。",
    category: "品質管理"
  },
  {
    id: 234,
    text: "品質基準は、顧客の要求に基づいて決定される。",
    answer: true,
    explanation: "品質基準は、顧客の要求と期待に基づいて決定されます。",
    category: "品質管理"
  },
  {
    id: 235,
    text: "品質記録は、保管する必要がない。",
    answer: false,
    explanation: "品質記録は、品質管理と追跡可能性のため、保管が必要です。",
    category: "品質管理"
  },
  {
    id: 236,
    text: "工程能力指数Cpkは、プロセスの中心のずれを考慮する。",
    answer: true,
    explanation: "Cpkは、プロセスの中心のずれを考慮した工程能力指数です。",
    category: "品質管理"
  },
  {
    id: 237,
    text: "品質管理は、コスト削減に貢献する。",
    answer: true,
    explanation: "品質管理により、不良品の削減と効率化が実現でき、コスト削減に貢献します。",
    category: "品質管理"
  },
  {
    id: 238,
    text: "抜取検査の結果は、ロット全体の品質を判定する。",
    answer: true,
    explanation: "抜取検査の結果から、ロット全体の品質が判定されます。",
    category: "品質管理"
  },
  {
    id: 239,
    text: "品質管理は、製品の信頼性を向上させる。",
    answer: true,
    explanation: "品質管理により、製品の信頼性と顧客満足度が向上します。",
    category: "品質管理"
  },
  {
    id: 240,
    text: "品質監査は、品質管理システムの有効性を確認する。",
    answer: true,
    explanation: "品質監査は、品質管理システムが有効に機能しているかを確認します。",
    category: "品質管理"
  },

  // 機械要素（20問）
  {
    id: 241,
    text: "ベアリングは、回転軸を支持する機械要素である。",
    answer: true,
    explanation: "ベアリングは、回転軸を支持し、摩擦を減らす機械要素です。",
    category: "機械要素"
  },
  {
    id: 242,
    text: "ボールベアリングは、玉を使用したベアリングである。",
    answer: true,
    explanation: "ボールベアリングは、鋼球を使用したベアリングです。",
    category: "機械要素"
  },
  {
    id: 243,
    text: "ローラベアリングは、円筒ローラを使用したベアリングである。",
    answer: true,
    explanation: "ローラベアリングは、円筒ローラを使用したベアリングです。",
    category: "機械要素"
  },
  {
    id: 244,
    text: "ばねは、力を吸収・放出する機械要素である。",
    answer: true,
    explanation: "ばねは、力を吸収・放出し、振動を減衰させる機械要素です。",
    category: "機械要素"
  },
  {
    id: 245,
    text: "圧縮ばねは、圧縮力に対して抵抗する。",
    answer: true,
    explanation: "圧縮ばねは、圧縮力に対して抵抗し、元の形に戻ろうとします。",
    category: "機械要素"
  },
  {
    id: 246,
    text: "引張ばねは、引張力に対して抵抗する。",
    answer: true,
    explanation: "引張ばねは、引張力に対して抵抗し、元の形に戻ろうとします。",
    category: "機械要素"
  },
  {
    id: 247,
    text: "軸は、回転力を伝達する機械要素である。",
    answer: true,
    explanation: "軸は、回転力を伝達し、ベアリングで支持される機械要素です。",
    category: "機械要素"
  },
  {
    id: 248,
    text: "キーは、軸と部品を固定する機械要素である。",
    answer: true,
    explanation: "キーは、軸と部品の相対回転を防ぐために使用される機械要素です。",
    category: "機械要素"
  },
  {
    id: 249,
    text: "シャフトカップリングは、2つの軸を接続する。",
    answer: true,
    explanation: "シャフトカップリングは、2つの軸を接続し、回転力を伝達します。",
    category: "機械要素"
  },
  {
    id: 250,
    text: "ベアリングの寿命は、回転数に影響を受けない。",
    answer: false,
    explanation: "ベアリングの寿命は、回転数と荷重に大きく影響を受けます。",
    category: "機械要素"
  },
  {
    id: 251,
    text: "ベアリングは、潤滑が必要である。",
    answer: true,
    explanation: "ベアリングの寿命と性能を確保するため、潤滑が必要です。",
    category: "機械要素"
  },
  {
    id: 252,
    text: "ばねの硬さは、ばね定数で表される。",
    answer: true,
    explanation: "ばね定数は、ばねの硬さを表す指標です。",
    category: "機械要素"
  },
  {
    id: 253,
    text: "軸の直径は、伝達するトルクに影響を与える。",
    answer: true,
    explanation: "軸の直径が大きいほど、より大きなトルクを伝達できます。",
    category: "機械要素"
  },
  {
    id: 254,
    text: "キーの形状は、標準化されている。",
    answer: true,
    explanation: "キーの形状はJISで標準化されています。",
    category: "機械要素"
  },
  {
    id: 255,
    text: "シャフトカップリングは、軸のずれを吸収できる。",
    answer: true,
    explanation: "可撓性カップリングは、軸のずれや角度ずれを吸収できます。",
    category: "機械要素"
  },
  {
    id: 256,
    text: "ベアリングの精度は、機械の精度に影響を与える。",
    answer: true,
    explanation: "ベアリングの精度が低いと、機械全体の精度に影響を与えます。",
    category: "機械要素"
  },
  {
    id: 257,
    text: "ばねの材料は、鋼が一般的である。",
    answer: true,
    explanation: "ばねの材料として、鋼が最も一般的に使用されています。",
    category: "機械要素"
  },
  {
    id: 258,
    text: "軸の強度は、直径と材料に依存する。",
    answer: true,
    explanation: "軸の強度は、直径と材料の強度に依存します。",
    category: "機械要素"
  },
  {
    id: 259,
    text: "機械要素の選定は、設計に重要である。",
    answer: true,
    explanation: "機械要素の選定は、機械の性能と信頼性に重要な影響を与えます。",
    category: "機械要素"
  },
  {
    id: 260,
    text: "ベアリングは、定期的なメンテナンスが必要である。",
    answer: true,
    explanation: "ベアリングの寿命を延ばすため、定期的なメンテナンスが必要です。",
    category: "機械要素"
  },

  // 加工方法（20問）
  {
    id: 261,
    text: "旋盤加工は、回転する工作物に工具を当てて加工する方法である。",
    answer: true,
    explanation: "旋盤加工は、工作物を回転させ、工具を当てて円筒形に加工します。",
    category: "加工方法"
  },
  {
    id: 262,
    text: "フライス加工は、回転する工具で工作物を加工する方法である。",
    answer: true,
    explanation: "フライス加工は、回転するフライス工具で工作物を加工します。",
    category: "加工方法"
  },
  {
    id: 263,
    text: "研磨加工は、砥石を使用した加工方法である。",
    answer: true,
    explanation: "研磨加工は、砥石で工作物の表面を研磨する加工方法です。",
    category: "加工方法"
  },
  {
    id: 264,
    text: "穴あけ加工は、ドリルを使用した加工方法である。",
    answer: true,
    explanation: "穴あけ加工は、回転するドリルで工作物に穴を開ける加工方法です。",
    category: "加工方法"
  },
  {
    id: 265,
    text: "ねじ切り加工は、旋盤で行うことができる。",
    answer: true,
    explanation: "ねじ切り加工は、旋盤やタップ・ダイスを使用して行います。",
    category: "加工方法"
  },
  {
    id: 266,
    text: "放電加工は、電気火花を利用した加工方法である。",
    answer: true,
    explanation: "放電加工は、電気火花により工作物を加工する特殊加工方法です。",
    category: "加工方法"
  },
  {
    id: 267,
    text: "超音波加工は、超音波を利用した加工方法である。",
    answer: true,
    explanation: "超音波加工は、超音波振動を利用した特殊加工方法です。",
    category: "加工方法"
  },
  {
    id: 268,
    text: "旋盤加工の表面粗さは、加工速度に影響を受けない。",
    answer: false,
    explanation: "加工速度は表面粗さに大きく影響します。速度が速いほど粗さが大きくなります。",
    category: "加工方法"
  },
  {
    id: 269,
    text: "フライス加工は、複雑な形状の加工に適している。",
    answer: true,
    explanation: "フライス加工は、複雑な形状や平面の加工に適しています。",
    category: "加工方法"
  },
  {
    id: 270,
    text: "研磨加工は、高精度な寸法精度を実現できる。",
    answer: true,
    explanation: "研磨加工は、高精度な寸法精度と優れた表面仕上げが実現できます。",
    category: "加工方法"
  },
  {
    id: 271,
    text: "旋盤加工の送り速度は、表面粗さに影響を与える。",
    answer: true,
    explanation: "送り速度が遅いほど、表面粗さは小さくなります。",
    category: "加工方法"
  },
  {
    id: 272,
    text: "フライス加工では、複数の工具を同時に使用できる。",
    answer: true,
    explanation: "フライス加工では、複数の工具を同時に使用して効率を上げることができます。",
    category: "加工方法"
  },
  {
    id: 273,
    text: "研磨加工は、砥粒の粒度により表面粗さが異なる。",
    answer: true,
    explanation: "砥粒の粒度が細かいほど、表面粗さは小さくなります。",
    category: "加工方法"
  },
  {
    id: 274,
    text: "穴あけ加工では、ドリルの回転速度が重要である。",
    answer: true,
    explanation: "ドリルの回転速度は、加工精度と工具寿命に影響を与えます。",
    category: "加工方法"
  },
  {
    id: 275,
    text: "ねじ切り加工では、ピッチが正確に制御される。",
    answer: true,
    explanation: "ねじ切り加工では、ピッチが正確に制御される必要があります。",
    category: "加工方法"
  },
  {
    id: 276,
    text: "放電加工は、硬い材料の加工に適している。",
    answer: true,
    explanation: "放電加工は、硬い材料や複雑な形状の加工に適しています。",
    category: "加工方法"
  },
  {
    id: 277,
    text: "超音波加工は、脆性材料の加工に適している。",
    answer: true,
    explanation: "超音波加工は、脆性材料の加工に適しています。",
    category: "加工方法"
  },
  {
    id: 278,
    text: "加工方法の選定は、材料と形状に依存する。",
    answer: true,
    explanation: "加工方法は、材料の種類と製品の形状により選定されます。",
    category: "加工方法"
  },
  {
    id: 279,
    text: "工具の寿命は、加工速度に影響を受ける。",
    answer: true,
    explanation: "加工速度が高いほど、工具の寿命は短くなります。",
    category: "加工方法"
  },
  {
    id: 280,
    text: "加工精度は、機械の精度と工具の精度に依存する。",
    answer: true,
    explanation: "加工精度は、機械と工具の精度に大きく依存します。",
    category: "加工方法"
  },

  // 材料（20問）
  {
    id: 281,
    text: "鋼は、鉄と炭素の合金である。",
    answer: true,
    explanation: "鋼は、鉄に炭素を含ませた合金で、機械部品に広く使用されます。",
    category: "材料"
  },
  {
    id: 282,
    text: "アルミニウムは、軽量で耐食性に優れている。",
    answer: true,
    explanation: "アルミニウムは、軽量で耐食性に優れ、航空機や自動車に使用されます。",
    category: "材料"
  },
  {
    id: 283,
    text: "ステンレス鋼は、耐食性に優れた鋼である。",
    answer: true,
    explanation: "ステンレス鋼は、クロムを含む鋼で、耐食性に優れています。",
    category: "材料"
  },
  {
    id: 284,
    text: "銅は、導電性に優れた非鉄金属である。",
    answer: true,
    explanation: "銅は、導電性と導熱性に優れ、電気部品に広く使用されます。",
    category: "材料"
  },
  {
    id: 285,
    text: "プラスチックは、軽量で加工性に優れている。",
    answer: true,
    explanation: "プラスチックは、軽量で加工性に優れ、様々な用途に使用されます。",
    category: "材料"
  },
  {
    id: 286,
    text: "炭素鋼は、炭素含有量により性質が異なる。",
    answer: true,
    explanation: "炭素鋼は、炭素含有量により硬度や強度が変わります。",
    category: "材料"
  },
  {
    id: 287,
    text: "合金鋼は、複数の元素を含む鋼である。",
    answer: true,
    explanation: "合金鋼は、鉄と炭素以外の元素を含む鋼で、特性を改善します。",
    category: "材料"
  },
  {
    id: 288,
    text: "鋳鉄は、炭素含有量が鋼より多い。",
    answer: true,
    explanation: "鋳鉄は、炭素含有量が2%以上で、鋼より脆い性質があります。",
    category: "材料"
  },
  {
    id: 289,
    text: "チタンは、軽量で強度に優れた金属である。",
    answer: true,
    explanation: "チタンは、軽量で強度に優れ、耐熱性も高い金属です。",
    category: "材料"
  },
  {
    id: 290,
    text: "材料の選定は、用途と環境条件を考慮する必要がある。",
    answer: true,
    explanation: "材料選定では、用途、環境条件、コストなど多くの要因を考慮します。",
    category: "材料"
  },
  {
    id: 291,
    text: "鋼の硬度は、熱処理により調整できる。",
    answer: true,
    explanation: "鋼の硬度は、焼入れ、焼戻しなどの熱処理により調整できます。",
    category: "材料"
  },
  {
    id: 292,
    text: "アルミニウム合金は、強度が低い。",
    answer: false,
    explanation: "アルミニウム合金は、適切な合金元素と熱処理により高い強度を実現できます。",
    category: "材料"
  },
  {
    id: 293,
    text: "ステンレス鋼は、磁性を持たない。",
    answer: false,
    explanation: "ステンレス鋼の種類により、磁性を持つものと持たないものがあります。",
    category: "材料"
  },
  {
    id: 294,
    text: "銅の導電性は、銀に次ぐ。",
    answer: true,
    explanation: "銅の導電性は、銀に次いで高く、電気部品に最も広く使用されます。",
    category: "材料"
  },
  {
    id: 295,
    text: "プラスチックの強度は、金属より低い。",
    answer: true,
    explanation: "プラスチックの強度は、一般的に金属より低いです。",
    category: "材料"
  },
  {
    id: 296,
    text: "炭素鋼の炭素含有量は、0～2%である。",
    answer: true,
    explanation: "炭素鋼の炭素含有量は、0～2%の範囲です。",
    category: "材料"
  },
  {
    id: 297,
    text: "合金鋼は、特殊な性質を必要とする部品に使用される。",
    answer: true,
    explanation: "合金鋼は、高強度、耐熱性、耐食性など特殊な性質が必要な部品に使用されます。",
    category: "材料"
  },
  {
    id: 298,
    text: "鋳鉄は、加工性が良い。",
    answer: false,
    explanation: "鋳鉄は脆く、加工性が悪いため、機械加工には不向きです。",
    category: "材料"
  },
  {
    id: 299,
    text: "チタンは、高温での強度を保つ。",
    answer: true,
    explanation: "チタンは、高温でも強度を保つため、航空機エンジンなどに使用されます。",
    category: "材料"
  },
  {
    id: 300,
    text: "材料の価格は、材料選定に重要な要因である。",
    answer: true,
    explanation: "材料の価格は、製品のコストに大きく影響するため、重要な選定要因です。",
    category: "材料"
  },

  // 図面（20問）
  {
    id: 301,
    text: "図面は、製品の形状と寸法を表現する。",
    answer: true,
    explanation: "図面は、製品の形状、寸法、精度などを正確に表現します。",
    category: "図面"
  },
  {
    id: 302,
    text: "正投影図は、複数の方向から見た図である。",
    answer: true,
    explanation: "正投影図は、正面図、側面図、平面図など複数の方向から見た図です。",
    category: "図面"
  },
  {
    id: 303,
    text: "寸法線は、図面上で寸法を表示するための線である。",
    answer: true,
    explanation: "寸法線は、寸法値を記入するための線で、図面の標準要素です。",
    category: "図面"
  },
  {
    id: 304,
    text: "公差記号は、寸法の許容範囲を表す。",
    answer: true,
    explanation: "公差記号は、寸法がどの程度の範囲で許容されるかを表します。",
    category: "図面"
  },
  {
    id: 305,
    text: "図面の縮尺は、実際の寸法に影響を与えない。",
    answer: true,
    explanation: "図面の縮尺は見た目の大きさに影響しますが、記入された寸法が実際の寸法です。",
    category: "図面"
  },
  {
    id: 306,
    text: "断面図は、部品の内部構造を表現する。",
    answer: true,
    explanation: "断面図は、部品を仮想的に切断して、内部構造を表現します。",
    category: "図面"
  },
  {
    id: 307,
    text: "部品図は、1つの部品の詳細を示す図である。",
    answer: true,
    explanation: "部品図は、1つの部品の形状、寸法、精度などを詳細に示します。",
    category: "図面"
  },
  {
    id: 308,
    text: "組立図は、複数の部品を組み立てた状態を示す図である。",
    answer: true,
    explanation: "組立図は、複数の部品がどのように組み立てられるかを示します。",
    category: "図面"
  },
  {
    id: 309,
    text: "図面の線の太さは、線の種類により異なる。",
    answer: true,
    explanation: "図面では、実線、破線、一点鎖線など、線の種類により太さが異なります。",
    category: "図面"
  },
  {
    id: 310,
    text: "図面は、JISで規定された標準に従って作成される。",
    answer: true,
    explanation: "図面はJIS規格に従って作成され、統一された表現が使用されます。",
    category: "図面"
  },
  {
    id: 311,
    text: "図面の記号は、国際的に統一されている。",
    answer: true,
    explanation: "図面の記号は、ISO規格により国際的に統一されています。",
    category: "図面"
  },
  {
    id: 312,
    text: "図面に記載される寸法は、すべて必要である。",
    answer: true,
    explanation: "図面に記載される寸法は、製品製造に必要なすべての寸法です。",
    category: "図面"
  },
  {
    id: 313,
    text: "図面の縮尺は、図面上に明記される。",
    answer: true,
    explanation: "図面の縮尺は、図面上に明記される必要があります。",
    category: "図面"
  },
  {
    id: 314,
    text: "等角図は、3次元の形状を2次元で表現する。",
    answer: true,
    explanation: "等角図は、3次元の形状を2次元で立体的に表現します。",
    category: "図面"
  },
  {
    id: 315,
    text: "図面の表題欄には、製品名と図番が記載される。",
    answer: true,
    explanation: "図面の表題欄には、製品名、図番、作成日、承認者などが記載されます。",
    category: "図面"
  },
  {
    id: 316,
    text: "図面は、製造部門への指示書である。",
    answer: true,
    explanation: "図面は、製造部門に対する製品製造の指示書です。",
    category: "図面"
  },
  {
    id: 317,
    text: "図面の修正は、承認を得て行われる。",
    answer: true,
    explanation: "図面の修正は、適切な承認を得て行われる必要があります。",
    category: "図面"
  },
  {
    id: 318,
    text: "図面には、材料と熱処理条件が記載される。",
    answer: true,
    explanation: "図面には、材料の種類と熱処理条件が記載されます。",
    category: "図面"
  },
  {
    id: 319,
    text: "図面は、製品の品質確保に重要である。",
    answer: true,
    explanation: "図面は、製品の品質確保と製造精度に重要な役割を果たします。",
    category: "図面"
  },
  {
    id: 320,
    text: "図面の保管は、適切に行われる必要がある。",
    answer: true,
    explanation: "図面は、重要な技術資産であり、適切に保管される必要があります。",
    category: "図面"
  },

  // 安全管理（20問）
  {
    id: 321,
    text: "測定機器の安全管理は、重要である。",
    answer: true,
    explanation: "測定機器の安全管理により、事故を防ぎ、精度を維持します。",
    category: "安全管理"
  },
  {
    id: 322,
    text: "測定機器は、定期的な点検が必要である。",
    answer: true,
    explanation: "測定機器の安全性と精度を確保するため、定期的な点検が必要です。",
    category: "安全管理"
  },
  {
    id: 323,
    text: "測定機器の取り扱いマニュアルを読む必要がない。",
    answer: false,
    explanation: "測定機器の安全で正確な使用のため、取り扱いマニュアルの確認は必須です。",
    category: "安全管理"
  },
  {
    id: 324,
    text: "測定機器の保管環境は、精度に影響を与える。",
    answer: true,
    explanation: "温度、湿度、振動などの保管環境は、測定機器の精度に影響します。",
    category: "安全管理"
  },
  {
    id: 325,
    text: "測定機器の校正は、定期的に行う必要がある。",
    answer: true,
    explanation: "測定機器の精度を確保するため、定期的な校正は必須です。",
    category: "安全管理"
  },
  {
    id: 326,
    text: "測定機器の落下は、精度に影響を与えない。",
    answer: false,
    explanation: "測定機器の落下は、精度に大きく影響を与える可能性があります。",
    category: "安全管理"
  },
  {
    id: 327,
    text: "測定機器の清掃は、定期的に行う必要がある。",
    answer: true,
    explanation: "測定機器の清掃により、精度を維持し、寿命を延ばします。",
    category: "安全管理"
  },
  {
    id: 328,
    text: "測定機器の修理は、専門家に依頼する必要がある。",
    answer: true,
    explanation: "測定機器の修理は、精度を確保するため、専門家に依頼すべきです。",
    category: "安全管理"
  },
  {
    id: 329,
    text: "測定機器の使用記録は、保管する必要がない。",
    answer: false,
    explanation: "測定機器の使用記録は、保守管理と精度確保のため、保管が必要です。",
    category: "安全管理"
  },
  {
    id: 330,
    text: "測定機器の安全な使用は、すべての作業者の責任である。",
    answer: true,
    explanation: "測定機器の安全な使用と管理は、すべての作業者の重要な責任です。",
    category: "安全管理"
  },
  {
    id: 331,
    text: "測定機器の過負荷は、精度に影響を与える。",
    answer: true,
    explanation: "測定機器に過度な負荷をかけると、精度に悪影響を与えます。",
    category: "安全管理"
  },
  {
    id: 332,
    text: "測定機器の環境温度は、測定精度に影響を与える。",
    answer: true,
    explanation: "測定機器の環境温度は、測定精度に大きく影響します。",
    category: "安全管理"
  },
  {
    id: 333,
    text: "測定機器の湿度管理は、不要である。",
    answer: false,
    explanation: "測定機器の湿度管理は、精度維持のため重要です。",
    category: "安全管理"
  },
  {
    id: 334,
    text: "測定機器の振動は、測定精度に影響を与える。",
    answer: true,
    explanation: "測定環境の振動は、測定精度に悪影響を与えます。",
    category: "安全管理"
  },
  {
    id: 335,
    text: "測定機器の校正記録は、保管する必要がある。",
    answer: true,
    explanation: "測定機器の校正記録は、精度管理と追跡可能性のため、保管が必要です。",
    category: "安全管理"
  },
  {
    id: 336,
    text: "測定機器の取り扱いには、訓練が必要である。",
    answer: true,
    explanation: "測定機器の正確で安全な使用のため、適切な訓練が必要です。",
    category: "安全管理"
  },
  {
    id: 337,
    text: "測定機器の精度は、使用頻度に関わらず一定である。",
    answer: false,
    explanation: "測定機器の精度は、使用頻度と使用環境により変化します。",
    category: "安全管理"
  },
  {
    id: 338,
    text: "測定機器の不具合は、すぐに報告する必要がある。",
    answer: true,
    explanation: "測定機器の不具合は、すぐに報告し、修理を依頼する必要があります。",
    category: "安全管理"
  },
  {
    id: 339,
    text: "測定機器の使用禁止は、安全管理の一部である。",
    answer: true,
    explanation: "不具合のある測定機器の使用禁止は、安全管理の重要な措置です。",
    category: "安全管理"
  },
  {
    id: 340,
    text: "測定機器の管理は、品質管理に重要である。",
    answer: true,
    explanation: "測定機器の適切な管理は、製品の品質確保に重要な役割を果たします。",
    category: "安全管理"
  }
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}
