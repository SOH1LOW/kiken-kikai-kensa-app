export interface Question {
  id: number;
  text: string;
  answer: boolean; // true = ◯, false = ×
  explanation: string;
  category: string;
}

export const questions: Question[] = [
  // 測定機器の基礎
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

  // 硬さ試験
  {
    id: 11,
    text: "ブリネル硬さ試験では、鋼球圧子を用いる。",
    answer: true,
    explanation: "ブリネル硬さ試験は直径10mmの鋼球を圧子として使用し、硬さを測定します。",
    category: "硬さ試験"
  },
  {
    id: 12,
    text: "ロックウェル硬さ試験は、ブリネル硬さ試験より測定時間が短い。",
    answer: true,
    explanation: "ロックウェル硬さ試験は自動化されており、ブリネル硬さ試験より測定時間が短いです。",
    category: "硬さ試験"
  },
  {
    id: 13,
    text: "ビッカース硬さ試験では、ダイヤモンド圧子を用いる。",
    answer: true,
    explanation: "ビッカース硬さ試験はダイヤモンド製の四角錐圧子を使用し、高精度な硬さ測定が可能です。",
    category: "硬さ試験"
  },
  {
    id: 14,
    text: "ショア硬さ試験は、反発硬さを測定する。",
    answer: true,
    explanation: "ショア硬さ試験はハンマーの反発高さにより硬さを測定する反発硬さ試験です。",
    category: "硬さ試験"
  },
  {
    id: 15,
    text: "ブリネル硬さの記号はHVである。",
    answer: false,
    explanation: "ブリネル硬さの記号はHBです。HVはビッカース硬さの記号です。",
    category: "硬さ試験"
  },
  {
    id: 16,
    text: "ロックウェル硬さには複数のスケールが存在する。",
    answer: true,
    explanation: "ロックウェル硬さはA、B、C、D、E、F、G、H、K、L、M、P、R、S、Vなど複数のスケールがあります。",
    category: "硬さ試験"
  },
  {
    id: 17,
    text: "ビッカース硬さ試験は、薄い材料の硬さ測定に適している。",
    answer: true,
    explanation: "ビッカース硬さ試験は荷重が小さく、薄い材料や表面硬化層の硬さ測定に適しています。",
    category: "硬さ試験"
  },
  {
    id: 18,
    text: "ショア硬さ試験は、接触式の硬さ試験である。",
    answer: false,
    explanation: "ショア硬さ試験は非接触式の反発硬さ試験です。ハンマーが材料に接触して反発します。",
    category: "硬さ試験"
  },
  {
    id: 19,
    text: "マイクロビッカース硬さ試験は、微小領域の硬さ測定に用いられる。",
    answer: true,
    explanation: "マイクロビッカース硬さ試験は非常に小さな荷重を使用し、微小領域の硬さを測定できます。",
    category: "硬さ試験"
  },
  {
    id: 20,
    text: "ブリネル硬さ試験では、測定後に圧痕が残る。",
    answer: true,
    explanation: "ブリネル硬さ試験は破壊的試験であり、測定後に球形の圧痕が材料に残ります。",
    category: "硬さ試験"
  },

  // 寸法測定
  {
    id: 21,
    text: "寸法測定では、測定環境の温度管理が重要である。",
    answer: true,
    explanation: "金属は温度により膨張・収縮するため、精密な寸法測定には温度管理が不可欠です。",
    category: "寸法測定"
  },
  {
    id: 22,
    text: "測定器は、使用前に必ずゼロ調整を行う必要がある。",
    answer: true,
    explanation: "測定器の精度を確保するため、使用前のゼロ調整は必須です。",
    category: "寸法測定"
  },
  {
    id: 23,
    text: "外径測定にはノギスを使用できない。",
    answer: false,
    explanation: "ノギスは外径測定に最も一般的に使用される測定器です。",
    category: "寸法測定"
  },
  {
    id: 24,
    text: "内径測定には、シリンダゲージやボアゲージが使用される。",
    answer: true,
    explanation: "内径測定にはシリンダゲージ、ボアゲージ、内側ノギスなどが使用されます。",
    category: "寸法測定"
  },
  {
    id: 25,
    text: "測定値の記録には、測定日時と測定者名を記載する必要がある。",
    answer: true,
    explanation: "測定記録の信頼性と追跡可能性のため、日時と測定者名の記載は重要です。",
    category: "寸法測定"
  },
  {
    id: 26,
    text: "寸法測定では、複数回測定して平均値を採用することが推奨される。",
    answer: true,
    explanation: "測定誤差を減らすため、複数回測定して平均値を採用することが標準的です。",
    category: "寸法測定"
  },
  {
    id: 27,
    text: "測定器の精度は、定期的な校正により確認される。",
    answer: true,
    explanation: "測定器の精度を維持するため、定期的な校正は必須です。",
    category: "寸法測定"
  },
  {
    id: 28,
    text: "測定値の有効数字は、測定器の精度に応じて決定される。",
    answer: true,
    explanation: "測定器の最小読取値に応じて、測定値の有効数字を適切に設定する必要があります。",
    category: "寸法測定"
  },
  {
    id: 29,
    text: "段差測定には、深さゲージやハイトゲージが使用される。",
    answer: true,
    explanation: "段差測定には深さゲージやハイトゲージが適しています。",
    category: "寸法測定"
  },
  {
    id: 30,
    text: "測定環境の湿度は、寸法測定に影響を与えない。",
    answer: false,
    explanation: "湿度は材料の吸湿による膨張に影響を与えるため、湿度管理も重要です。",
    category: "寸法測定"
  },

  // 幾何公差
  {
    id: 31,
    text: "真直度は、直線の真っすぐさを表す公差である。",
    answer: true,
    explanation: "真直度は、直線がどの程度真っすぐであるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 32,
    text: "平面度は、平面がどの程度平らであるかを表す公差である。",
    answer: true,
    explanation: "平面度は、平面がどの程度平らであるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 33,
    text: "円筒度は、円筒がどの程度正確な円筒であるかを表す公差である。",
    answer: true,
    explanation: "円筒度は、円筒がどの程度正確な円筒形状であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 34,
    text: "垂直度は、2つの直線がどの程度垂直であるかを表す公差である。",
    answer: true,
    explanation: "垂直度は、2つの直線や平面がどの程度垂直であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 35,
    text: "平行度は、2つの直線がどの程度平行であるかを表す公差である。",
    answer: true,
    explanation: "平行度は、2つの直線や平面がどの程度平行であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 36,
    text: "同心度は、2つの円がどの程度同じ中心を持つかを表す公差である。",
    answer: true,
    explanation: "同心度は、2つの円がどの程度同じ中心を持つかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 37,
    text: "対称度は、2つの要素がどの程度対称であるかを表す公差である。",
    answer: true,
    explanation: "対称度は、2つの要素がどの程度対称であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 38,
    text: "位置度は、要素の位置がどの程度正確であるかを表す公差である。",
    answer: true,
    explanation: "位置度は、穴や突起などの要素の位置がどの程度正確であるかを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 39,
    text: "振れ公差は、回転時の振れの大きさを表す公差である。",
    answer: true,
    explanation: "振れ公差は、要素が回転軸を中心に回転するときの振れの大きさを表す幾何公差です。",
    category: "幾何公差"
  },
  {
    id: 40,
    text: "幾何公差は、寸法公差と同時に指定することはできない。",
    answer: false,
    explanation: "幾何公差と寸法公差は同時に指定でき、両者を組み合わせて製品の精度を確保します。",
    category: "幾何公差"
  },

  // 表面性状
  {
    id: 41,
    text: "表面粗さは、表面の凹凸の大きさを表す。",
    answer: true,
    explanation: "表面粗さは、表面の微細な凹凸の大きさを表す指標です。",
    category: "表面性状"
  },
  {
    id: 42,
    text: "表面粗さの記号Raは、算術平均粗さを表す。",
    answer: true,
    explanation: "Raは算術平均粗さ（中心線平均粗さ）を表す最も一般的な表面粗さの指標です。",
    category: "表面性状"
  },
  {
    id: 43,
    text: "表面粗さの記号Rzは、最大高さを表す。",
    answer: true,
    explanation: "Rzは最大高さ粗さを表し、最も高い山と最も深い谷の差です。",
    category: "表面性状"
  },
  {
    id: 44,
    text: "表面粗さは、加工方法により異なる。",
    answer: true,
    explanation: "旋盤加工、フライス加工、研磨など、加工方法により表面粗さは大きく異なります。",
    category: "表面性状"
  },
  {
    id: 45,
    text: "表面粗さの測定には、触針式粗さ計が最も一般的である。",
    answer: true,
    explanation: "触針式粗さ計は、針を表面に接触させて粗さを測定する最も一般的な測定器です。",
    category: "表面性状"
  },
  {
    id: 46,
    text: "表面粗さの単位はμmである。",
    answer: true,
    explanation: "表面粗さの単位は一般的にμm（マイクロメートル）です。",
    category: "表面性状"
  },
  {
    id: 47,
    text: "非接触式粗さ計は、触針式粗さ計より測定精度が高い。",
    answer: false,
    explanation: "触針式粗さ計の方が測定精度が高く、より広く使用されています。",
    category: "表面性状"
  },
  {
    id: 48,
    text: "表面粗さは、製品の機能に影響を与えない。",
    answer: false,
    explanation: "表面粗さは摩擦、耐久性、密閉性など、製品の機能に大きく影響します。",
    category: "表面性状"
  },
  {
    id: 49,
    text: "研磨加工により、表面粗さを大幅に改善できる。",
    answer: true,
    explanation: "研磨加工は表面粗さを大幅に改善でき、高精度な表面仕上げが可能です。",
    category: "表面性状"
  },
  {
    id: 50,
    text: "表面粗さの測定値は、測定方向に影響を受ける。",
    answer: true,
    explanation: "表面粗さは加工の方向性により異なるため、測定方向は重要です。",
    category: "表面性状"
  },

  // ねじ測定
  {
    id: 51,
    text: "ねじの有効径は、ねじの外径と内径の平均である。",
    answer: true,
    explanation: "ねじの有効径（ピッチ径）は、外径と内径の中点にあります。",
    category: "ねじ測定"
  },
  {
    id: 52,
    text: "ねじゲージは、ねじの寸法を測定するために使用される。",
    answer: true,
    explanation: "ねじゲージはねじの有効径やピッチを測定する専用測定器です。",
    category: "ねじ測定"
  },
  {
    id: 53,
    text: "ねじのピッチは、隣同士の山の間隔である。",
    answer: true,
    explanation: "ねじのピッチは、隣同士の山（または谷）の間隔を表します。",
    category: "ねじ測定"
  },
  {
    id: 54,
    text: "マイクロメータを使用してねじの有効径を直接測定できる。",
    answer: false,
    explanation: "ねじの有効径は直接測定できず、ねじゲージや3本ワイヤ法などの方法を使用します。",
    category: "ねじ測定"
  },
  {
    id: 55,
    text: "3本ワイヤ法は、ねじの有効径を測定する方法である。",
    answer: true,
    explanation: "3本ワイヤ法は、3本の同じ直径のワイヤを使用してねじの有効径を測定する方法です。",
    category: "ねじ測定"
  },
  {
    id: 56,
    text: "ねじゲージは、ねじの合否を判定するために使用される。",
    answer: true,
    explanation: "ねじゲージはGO/NOGOゲージとして、ねじの合否判定に使用されます。",
    category: "ねじ測定"
  },
  {
    id: 57,
    text: "メートルねじとインチねじは、ピッチが異なる。",
    answer: true,
    explanation: "メートルねじはmmで、インチねじはインチで表示され、ピッチが異なります。",
    category: "ねじ測定"
  },
  {
    id: 58,
    text: "ねじの外径は、ねじの最も大きい直径である。",
    answer: true,
    explanation: "ねじの外径は、ねじの最も大きい直径で、呼び径とも呼ばれます。",
    category: "ねじ測定"
  },
  {
    id: 59,
    text: "ねじの内径は、ねじの最も小さい直径である。",
    answer: true,
    explanation: "ねじの内径は、ねじの最も小さい直径で、谷の直径です。",
    category: "ねじ測定"
  },
  {
    id: 60,
    text: "ねじの精度等級は、JISで規定されている。",
    answer: true,
    explanation: "ねじの精度等級はJISで規定され、複数の等級があります。",
    category: "ねじ測定"
  },

  // 歯車測定
  {
    id: 61,
    text: "歯車のモジュールは、歯の大きさを表す。",
    answer: true,
    explanation: "モジュールは歯の大きさを表す指標で、モジュール値が大きいほど歯が大きいです。",
    category: "歯車測定"
  },
  {
    id: 62,
    text: "歯車の歯数は、歯車の回転速度に影響を与える。",
    answer: true,
    explanation: "歯数が多いほど回転速度は遅くなり、トルクは大きくなります。",
    category: "歯車測定"
  },
  {
    id: 63,
    text: "歯車のピッチ円直径は、モジュール×歯数で計算される。",
    answer: true,
    explanation: "ピッチ円直径 = モジュール × 歯数で計算されます。",
    category: "歯車測定"
  },
  {
    id: 64,
    text: "歯車の圧力角は、歯の形状に影響を与える。",
    answer: true,
    explanation: "圧力角は歯の形状を決定する重要なパラメータです。",
    category: "歯車測定"
  },
  {
    id: 65,
    text: "歯車の歯厚は、マイクロメータで直接測定できる。",
    answer: false,
    explanation: "歯厚は複雑な形状のため、専用の歯厚測定器や計算により測定します。",
    category: "歯車測定"
  },
  {
    id: 66,
    text: "歯車の振れは、回転時の振動に影響を与える。",
    answer: true,
    explanation: "歯車の振れが大きいと、回転時に振動が生じます。",
    category: "歯車測定"
  },
  {
    id: 67,
    text: "歯車の歯面粗さは、騒音と摩耗に影響を与える。",
    answer: true,
    explanation: "歯面粗さが大きいと、騒音が増加し、摩耗も進みやすくなります。",
    category: "歯車測定"
  },
  {
    id: 68,
    text: "歯車のバックラッシは、歯車間の隙間である。",
    answer: true,
    explanation: "バックラッシは、かみ合う2つの歯車間の隙間を表します。",
    category: "歯車測定"
  },
  {
    id: 69,
    text: "歯車の精度等級は、JISで規定されている。",
    answer: true,
    explanation: "歯車の精度等級はJISで規定され、複数の等級があります。",
    category: "歯車測定"
  },
  {
    id: 70,
    text: "歯車の材料は、鋼が最も一般的である。",
    answer: true,
    explanation: "歯車の材料として、鋼が最も一般的に使用されています。",
    category: "歯車測定"
  },

  // 角度測定
  {
    id: 71,
    text: "角度ゲージは、角度を測定するために使用される。",
    answer: true,
    explanation: "角度ゲージは、2つの直線がなす角度を測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 72,
    text: "分度器は、精密な角度測定に適している。",
    answer: false,
    explanation: "分度器は簡易的な測定器で、精密な角度測定には角度ゲージを使用します。",
    category: "角度測定"
  },
  {
    id: 73,
    text: "デジタル角度ゲージは、アナログ角度ゲージより読み取り誤差が少ない。",
    answer: true,
    explanation: "デジタル角度ゲージはデジタル表示により、読み取り誤差が少なくなります。",
    category: "角度測定"
  },
  {
    id: 74,
    text: "傾斜角の測定には、傾斜計が使用される。",
    answer: true,
    explanation: "傾斜計は、水平面からの傾斜角を測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 75,
    text: "角度の単位は、度（°）とラジアン（rad）がある。",
    answer: true,
    explanation: "角度の単位として、度（°）とラジアン（rad）が使用されます。",
    category: "角度測定"
  },
  {
    id: 76,
    text: "正弦定規は、小さな角度を測定するために使用される。",
    answer: true,
    explanation: "正弦定規は、小さな角度を高精度で測定する測定器です。",
    category: "角度測定"
  },
  {
    id: 77,
    text: "角度測定では、基準面の平面度が重要である。",
    answer: true,
    explanation: "角度測定の精度は、基準面の平面度に大きく影響します。",
    category: "角度測定"
  },
  {
    id: 78,
    text: "ベベルプロトラクタは、複雑な角度を測定できる。",
    answer: true,
    explanation: "ベベルプロトラクタは、複雑な角度を測定できる精密な角度測定器です。",
    category: "角度測定"
  },
  {
    id: 79,
    text: "角度ゲージは、直線の垂直度測定に使用できる。",
    answer: true,
    explanation: "角度ゲージは、垂直度や平行度などの角度関連の測定に使用できます。",
    category: "角度測定"
  },
  {
    id: 80,
    text: "角度の測定値は、温度に影響を受けない。",
    answer: false,
    explanation: "角度測定器も金属製のため、温度により膨張・収縮し、測定値に影響を与えます。",
    category: "角度測定"
  },

  // 光学測定
  {
    id: 81,
    text: "光学測定は、非接触式の測定方法である。",
    answer: true,
    explanation: "光学測定は光を使用した非接触式の測定方法です。",
    category: "光学測定"
  },
  {
    id: 82,
    text: "投影機は、小さな部品の寸法測定に適している。",
    answer: true,
    explanation: "投影機は、部品を拡大投影して寸法を測定するため、小さな部品の測定に適しています。",
    category: "光学測定"
  },
  {
    id: 83,
    text: "レーザー測定器は、長距離の測定に適している。",
    answer: true,
    explanation: "レーザー測定器は、長距離の測定に適した非接触式測定器です。",
    category: "光学測定"
  },
  {
    id: 84,
    text: "光学測定では、光源の安定性が重要である。",
    answer: true,
    explanation: "光学測定の精度は、光源の安定性に大きく影響します。",
    category: "光学測定"
  },
  {
    id: 85,
    text: "CCD測定器は、画像処理により寸法を測定する。",
    answer: true,
    explanation: "CCD測定器は、CCDカメラで撮影した画像を処理して寸法を測定します。",
    category: "光学測定"
  },
  {
    id: 86,
    text: "光学測定は、表面が鏡面でない場合は使用できない。",
    answer: false,
    explanation: "光学測定は、表面の状態に関わらず使用できます。",
    category: "光学測定"
  },
  {
    id: 87,
    text: "投影機の倍率は、調整可能である。",
    answer: true,
    explanation: "投影機の倍率は、対物レンズの交換により調整できます。",
    category: "光学測定"
  },
  {
    id: 88,
    text: "レーザー測定器は、透明な材料の測定に適している。",
    answer: true,
    explanation: "レーザー測定器は、透明な材料の測定にも適しています。",
    category: "光学測定"
  },
  {
    id: 89,
    text: "光学測定では、キャリブレーションが必要である。",
    answer: true,
    explanation: "光学測定器の精度を確保するため、定期的なキャリブレーションが必要です。",
    category: "光学測定"
  },
  {
    id: 90,
    text: "画像測定機は、複雑な形状の寸法測定に適している。",
    answer: true,
    explanation: "画像測定機は、複雑な形状の部品の寸法を正確に測定できます。",
    category: "光学測定"
  },

  // 材料試験
  {
    id: 91,
    text: "引張試験は、材料の強度を測定する試験である。",
    answer: true,
    explanation: "引張試験は、材料に引張力を加えて強度や伸びを測定する試験です。",
    category: "材料試験"
  },
  {
    id: 92,
    text: "圧縮試験は、材料の圧縮強度を測定する試験である。",
    answer: true,
    explanation: "圧縮試験は、材料に圧縮力を加えて圧縮強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 93,
    text: "曲げ試験は、材料の曲げ強度を測定する試験である。",
    answer: true,
    explanation: "曲げ試験は、材料に曲げ力を加えて曲げ強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 94,
    text: "衝撃試験は、材料の衝撃耐性を測定する試験である。",
    answer: true,
    explanation: "衝撃試験は、材料に衝撃を与えて衝撃耐性を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 95,
    text: "疲労試験は、材料の疲労強度を測定する試験である。",
    answer: true,
    explanation: "疲労試験は、材料に繰り返し応力を加えて疲労強度を測定する試験です。",
    category: "材料試験"
  },
  {
    id: 96,
    text: "引張試験では、材料の降伏点と引張強度が測定される。",
    answer: true,
    explanation: "引張試験により、降伏点、引張強度、伸びなどが測定されます。",
    category: "材料試験"
  },
  {
    id: 97,
    text: "材料試験は、破壊的試験である。",
    answer: true,
    explanation: "材料試験は、試験片を破壊させるため、破壊的試験です。",
    category: "材料試験"
  },
  {
    id: 98,
    text: "引張試験の試験速度は、試験結果に影響を与えない。",
    answer: false,
    explanation: "試験速度は試験結果に影響を与えるため、JISで規定されています。",
    category: "材料試験"
  },
  {
    id: 99,
    text: "材料試験の試験片は、JISで規定されている。",
    answer: true,
    explanation: "材料試験の試験片の形状・寸法はJISで規定されています。",
    category: "材料試験"
  },
  {
    id: 100,
    text: "高温材料試験では、試験温度の管理が重要である。",
    answer: true,
    explanation: "高温材料試験では、試験温度を正確に管理することが重要です。",
    category: "材料試験"
  },

  // 非破壊検査
  {
    id: 101,
    text: "超音波探傷検査は、非破壊検査の一種である。",
    answer: true,
    explanation: "超音波探傷検査は、超音波を使用して材料内部の欠陥を検出する非破壊検査です。",
    category: "非破壊検査"
  },
  {
    id: 102,
    text: "磁粉探傷検査は、磁性材料の表面欠陥を検出する。",
    answer: true,
    explanation: "磁粉探傷検査は、磁性材料の表面欠陥を磁粉で可視化して検出します。",
    category: "非破壊検査"
  },
  {
    id: 103,
    text: "浸透探傷検査は、非磁性材料の表面欠陥を検出する。",
    answer: true,
    explanation: "浸透探傷検査は、非磁性材料の表面欠陥を浸透液で検出します。",
    category: "非破壊検査"
  },
  {
    id: 104,
    text: "渦電流探傷検査は、導電性材料の欠陥を検出する。",
    answer: true,
    explanation: "渦電流探傷検査は、渦電流を使用して導電性材料の欠陥を検出します。",
    category: "非破壊検査"
  },
  {
    id: 105,
    text: "放射線透過検査は、材料内部の欠陥を検出する。",
    answer: true,
    explanation: "放射線透過検査は、X線やγ線を使用して材料内部の欠陥を検出します。",
    category: "非破壊検査"
  },
  {
    id: 106,
    text: "超音波探傷検査では、超音波の反射を利用する。",
    answer: true,
    explanation: "超音波探傷検査は、超音波の反射波を検出して欠陥を判定します。",
    category: "非破壊検査"
  },
  {
    id: 107,
    text: "非破壊検査は、製品の品質確保に重要である。",
    answer: true,
    explanation: "非破壊検査により、製品の内部欠陥を検出し、品質を確保します。",
    category: "非破壊検査"
  },
  {
    id: 108,
    text: "磁粉探傷検査は、非磁性材料にも適用できる。",
    answer: false,
    explanation: "磁粉探傷検査は磁性材料のみに適用でき、非磁性材料には浸透探傷検査を使用します。",
    category: "非破壊検査"
  },
  {
    id: 109,
    text: "渦電流探傷検査は、表面欠陥の検出に適している。",
    answer: true,
    explanation: "渦電流探傷検査は、表面から数mm程度の欠陥検出に適しています。",
    category: "非破壊検査"
  },
  {
    id: 110,
    text: "非破壊検査の検査員は、資格を取得する必要がある。",
    answer: true,
    explanation: "非破壊検査の検査員は、JISで規定された資格を取得する必要があります。",
    category: "非破壊検査"
  },

  // 品質管理
  {
    id: 111,
    text: "品質管理は、製品の品質を確保するための活動である。",
    answer: true,
    explanation: "品質管理は、製品が要求される品質を満たすようにするための活動です。",
    category: "品質管理"
  },
  {
    id: 112,
    text: "統計的品質管理は、統計手法を使用した品質管理である。",
    answer: true,
    explanation: "統計的品質管理は、統計手法を使用して品質を管理する方法です。",
    category: "品質管理"
  },
  {
    id: 113,
    text: "管理図は、プロセスの安定性を監視するために使用される。",
    answer: true,
    explanation: "管理図は、プロセスが統計的に管理状態にあるかを監視します。",
    category: "品質管理"
  },
  {
    id: 114,
    text: "抜取検査は、全数検査より効率的である。",
    answer: true,
    explanation: "抜取検査は、全数検査より検査時間と費用が少なくて済みます。",
    category: "品質管理"
  },
  {
    id: 115,
    text: "AQL（許容品質水準）は、抜取検査の合格基準である。",
    answer: true,
    explanation: "AQLは、抜取検査で合格と判定するための許容品質水準です。",
    category: "品質管理"
  },
  {
    id: 116,
    text: "ロットは、同じ条件で製造された製品の集合である。",
    answer: true,
    explanation: "ロットは、同じ条件で製造された製品の単位です。",
    category: "品質管理"
  },
  {
    id: 117,
    text: "不良率は、不良品の数を全製品数で割った値である。",
    answer: true,
    explanation: "不良率 = 不良品数 ÷ 全製品数で計算されます。",
    category: "品質管理"
  },
  {
    id: 118,
    text: "品質管理は、製造部門だけの責任である。",
    answer: false,
    explanation: "品質管理は、企業全体の活動であり、全部門の協力が必要です。",
    category: "品質管理"
  },
  {
    id: 119,
    text: "工程能力指数は、プロセスの能力を表す指標である。",
    answer: true,
    explanation: "工程能力指数（Cp、Cpk）は、プロセスが要求を満たす能力を表します。",
    category: "品質管理"
  },
  {
    id: 120,
    text: "品質改善は、継続的な活動である。",
    answer: true,
    explanation: "品質改善は、一度の改善ではなく、継続的に行う必要があります。",
    category: "品質管理"
  },

  // 機械要素
  {
    id: 121,
    text: "ベアリングは、回転軸を支持する機械要素である。",
    answer: true,
    explanation: "ベアリングは、回転軸を支持し、摩擦を減らす機械要素です。",
    category: "機械要素"
  },
  {
    id: 122,
    text: "ボールベアリングは、玉を使用したベアリングである。",
    answer: true,
    explanation: "ボールベアリングは、鋼球を使用したベアリングです。",
    category: "機械要素"
  },
  {
    id: 123,
    text: "ローラベアリングは、円筒ローラを使用したベアリングである。",
    answer: true,
    explanation: "ローラベアリングは、円筒ローラを使用したベアリングです。",
    category: "機械要素"
  },
  {
    id: 124,
    text: "ばねは、力を吸収・放出する機械要素である。",
    answer: true,
    explanation: "ばねは、力を吸収・放出し、振動を減衰させる機械要素です。",category: "機械要素"
  },
  {
    id: 125,
    text: "圧縮ばねは、圧縮力に対して抵抗する。",
    answer: true,
    explanation: "圧縮ばねは、圧縮力に対して抵抗し、元の形に戻ろうとします。",
    category: "機械要素"
  },
  {
    id: 126,
    text: "引張ばねは、引張力に対して抵抗する。",
    answer: true,
    explanation: "引張ばねは、引張力に対して抵抗し、元の形に戻ろうとします。",
    category: "機械要素"
  },
  {
    id: 127,
    text: "軸は、回転力を伝達する機械要素である。",
    answer: true,
    explanation: "軸は、回転力を伝達し、ベアリングで支持される機械要素です。",
    category: "機械要素"
  },
  {
    id: 128,
    text: "キーは、軸と部品を固定する機械要素である。",
    answer: true,
    explanation: "キーは、軸と部品の相対回転を防ぐために使用される機械要素です。",
    category: "機械要素"
  },
  {
    id: 129,
    text: "シャフトカップリングは、2つの軸を接続する。",
    answer: true,
    explanation: "シャフトカップリングは、2つの軸を接続し、回転力を伝達します。",
    category: "機械要素"
  },
  {
    id: 130,
    text: "ベアリングの寿命は、回転数に影響を受けない。",
    answer: false,
    explanation: "ベアリングの寿命は、回転数と荷重に大きく影響を受けます。",
    category: "機械要素"
  },

  // 加工方法
  {
    id: 131,
    text: "旋盤加工は、回転する工作物に工具を当てて加工する方法である。",
    answer: true,
    explanation: "旋盤加工は、工作物を回転させ、工具を当てて円筒形に加工します。",
    category: "加工方法"
  },
  {
    id: 132,
    text: "フライス加工は、回転する工具で工作物を加工する方法である。",
    answer: true,
    explanation: "フライス加工は、回転するフライス工具で工作物を加工します。",
    category: "加工方法"
  },
  {
    id: 133,
    text: "研磨加工は、砥石を使用した加工方法である。",
    answer: true,
    explanation: "研磨加工は、砥石で工作物の表面を研磨する加工方法です。",
    category: "加工方法"
  },
  {
    id: 134,
    text: "穴あけ加工は、ドリルを使用した加工方法である。",
    answer: true,
    explanation: "穴あけ加工は、回転するドリルで工作物に穴を開ける加工方法です。",
    category: "加工方法"
  },
  {
    id: 135,
    text: "ねじ切り加工は、旋盤で行うことができる。",
    answer: true,
    explanation: "ねじ切り加工は、旋盤やタップ・ダイスを使用して行います。",
    category: "加工方法"
  },
  {
    id: 136,
    text: "放電加工は、電気火花を利用した加工方法である。",
    answer: true,
    explanation: "放電加工は、電気火花により工作物を加工する特殊加工方法です。",
    category: "加工方法"
  },
  {
    id: 137,
    text: "超音波加工は、超音波を利用した加工方法である。",
    answer: true,
    explanation: "超音波加工は、超音波振動を利用した特殊加工方法です。",
    category: "加工方法"
  },
  {
    id: 138,
    text: "旋盤加工の表面粗さは、加工速度に影響を受けない。",
    answer: false,
    explanation: "加工速度は表面粗さに大きく影響します。速度が速いほど粗さが大きくなります。",
    category: "加工方法"
  },
  {
    id: 139,
    text: "フライス加工は、複雑な形状の加工に適している。",
    answer: true,
    explanation: "フライス加工は、複雑な形状や平面の加工に適しています。",
    category: "加工方法"
  },
  {
    id: 140,
    text: "研磨加工は、高精度な寸法精度を実現できる。",
    answer: true,
    explanation: "研磨加工は、高精度な寸法精度と優れた表面仕上げが実現できます。",
    category: "加工方法"
  },

  // 材料
  {
    id: 141,
    text: "鋼は、鉄と炭素の合金である。",
    answer: true,
    explanation: "鋼は、鉄に炭素を含ませた合金で、機械部品に広く使用されます。",
    category: "材料"
  },
  {
    id: 142,
    text: "アルミニウムは、軽量で耐食性に優れている。",
    answer: true,
    explanation: "アルミニウムは、軽量で耐食性に優れ、航空機や自動車に使用されます。",
    category: "材料"
  },
  {
    id: 143,
    text: "ステンレス鋼は、耐食性に優れた鋼である。",
    answer: true,
    explanation: "ステンレス鋼は、クロムを含む鋼で、耐食性に優れています。",
    category: "材料"
  },
  {
    id: 144,
    text: "銅は、導電性に優れた非鉄金属である。",
    answer: true,
    explanation: "銅は、導電性と導熱性に優れ、電気部品に広く使用されます。",
    category: "材料"
  },
  {
    id: 145,
    text: "プラスチックは、軽量で加工性に優れている。",
    answer: true,
    explanation: "プラスチックは、軽量で加工性に優れ、様々な用途に使用されます。",
    category: "材料"
  },
  {
    id: 146,
    text: "炭素鋼は、炭素含有量により性質が異なる。",
    answer: true,
    explanation: "炭素鋼は、炭素含有量により硬度や強度が変わります。",
    category: "材料"
  },
  {
    id: 147,
    text: "合金鋼は、複数の元素を含む鋼である。",
    answer: true,
    explanation: "合金鋼は、鉄と炭素以外の元素を含む鋼で、特性を改善します。",
    category: "材料"
  },
  {
    id: 148,
    text: "鋳鉄は、炭素含有量が鋼より多い。",
    answer: true,
    explanation: "鋳鉄は、炭素含有量が2%以上で、鋼より脆い性質があります。",
    category: "材料"
  },
  {
    id: 149,
    text: "チタンは、軽量で強度に優れた金属である。",
    answer: true,
    explanation: "チタンは、軽量で強度に優れ、耐熱性も高い金属です。",
    category: "材料"
  },
  {
    id: 150,
    text: "材料の選定は、用途と環境条件を考慮する必要がある。",
    answer: true,
    explanation: "材料選定では、用途、環境条件、コストなど多くの要因を考慮します。",
    category: "材料"
  },

  // 図面
  {
    id: 151,
    text: "図面は、製品の形状と寸法を表現する。",
    answer: true,
    explanation: "図面は、製品の形状、寸法、精度などを正確に表現します。",
    category: "図面"
  },
  {
    id: 152,
    text: "正投影図は、複数の方向から見た図である。",
    answer: true,
    explanation: "正投影図は、正面図、側面図、平面図など複数の方向から見た図です。",
    category: "図面"
  },
  {
    id: 153,
    text: "寸法線は、図面上で寸法を表示するための線である。",
    answer: true,
    explanation: "寸法線は、寸法値を記入するための線で、図面の標準要素です。",
    category: "図面"
  },
  {
    id: 154,
    text: "公差記号は、寸法の許容範囲を表す。",
    answer: true,
    explanation: "公差記号は、寸法がどの程度の範囲で許容されるかを表します。",
    category: "図面"
  },
  {
    id: 155,
    text: "図面の縮尺は、実際の寸法に影響を与えない。",
    answer: true,
    explanation: "図面の縮尺は見た目の大きさに影響しますが、記入された寸法が実際の寸法です。",
    category: "図面"
  },
  {
    id: 156,
    text: "断面図は、部品の内部構造を表現する。",
    answer: true,
    explanation: "断面図は、部品を仮想的に切断して、内部構造を表現します。",
    category: "図面"
  },
  {
    id: 157,
    text: "部品図は、1つの部品の詳細を示す図である。",
    answer: true,
    explanation: "部品図は、1つの部品の形状、寸法、精度などを詳細に示します。",
    category: "図面"
  },
  {
    id: 158,
    text: "組立図は、複数の部品を組み立てた状態を示す図である。",
    answer: true,
    explanation: "組立図は、複数の部品がどのように組み立てられるかを示します。",
    category: "図面"
  },
  {
    id: 159,
    text: "図面の線の太さは、線の種類により異なる。",
    answer: true,
    explanation: "図面では、実線、破線、一点鎖線など、線の種類により太さが異なります。",
    category: "図面"
  },
  {
    id: 160,
    text: "図面は、JISで規定された標準に従って作成される。",
    answer: true,
    explanation: "図面はJIS規格に従って作成され、統一された表現が使用されます。",
    category: "図面"
  },

  // 安全管理
  {
    id: 161,
    text: "測定機器の安全管理は、重要である。",
    answer: true,
    explanation: "測定機器の安全管理により、事故を防ぎ、精度を維持します。",
    category: "安全管理"
  },
  {
    id: 162,
    text: "測定機器は、定期的な点検が必要である。",
    answer: true,
    explanation: "測定機器の安全性と精度を確保するため、定期的な点検が必要です。",
    category: "安全管理"
  },
  {
    id: 163,
    text: "測定機器の取り扱いマニュアルを読む必要がない。",
    answer: false,
    explanation: "測定機器の安全で正確な使用のため、取り扱いマニュアルの確認は必須です。",
    category: "安全管理"
  },
  {
    id: 164,
    text: "測定機器の保管環境は、精度に影響を与える。",
    answer: true,
    explanation: "温度、湿度、振動などの保管環境は、測定機器の精度に影響します。",
    category: "安全管理"
  },
  {
    id: 165,
    text: "測定機器の校正は、定期的に行う必要がある。",
    answer: true,
    explanation: "測定機器の精度を確保するため、定期的な校正は必須です。",
    category: "安全管理"
  },
  {
    id: 166,
    text: "測定機器の落下は、精度に影響を与えない。",
    answer: false,
    explanation: "測定機器の落下は、精度に大きく影響を与える可能性があります。",
    category: "安全管理"
  },
  {
    id: 167,
    text: "測定機器の清掃は、定期的に行う必要がある。",
    answer: true,
    explanation: "測定機器の清掃により、精度を維持し、寿命を延ばします。",
    category: "安全管理"
  },
  {
    id: 168,
    text: "測定機器の修理は、専門家に依頼する必要がある。",
    answer: true,
    explanation: "測定機器の修理は、精度を確保するため、専門家に依頼すべきです。",
    category: "安全管理"
  },
  {
    id: 169,
    text: "測定機器の使用記録は、保管する必要がない。",
    answer: false,
    explanation: "測定機器の使用記録は、保守管理と精度確保のため、保管が必要です。",
    category: "安全管理"
  },
  {
    id: 170,
    text: "測定機器の安全な使用は、すべての作業者の責任である。",
    answer: true,
    explanation: "測定機器の安全な使用と管理は、すべての作業者の重要な責任です。",
    category: "安全管理"
  },
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}
