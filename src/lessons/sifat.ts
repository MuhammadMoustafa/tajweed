import type { Lesson } from './types'

// The data table (letter → qualities, and each quality's letters) is src/animations/mouth/sifat.ts;
// this file holds the lesson's prose. Mnemonic phrases are the classical ones, not Quran text.
export const sifat: Lesson = {
  id: 'sifat',
  order: 10,
  unit: 'deeper',
  title: { ar: 'صفات الحروف', en: 'Sifat al-huruf (the letters’ qualities)' },
  summary: {
    ar: 'لكل حرف صفات تميّزه عن غيره: خمس صفات متضادة يأخذ الحرف واحدة من كل زوج منها، وسبع صفات لا ضد لها تختص بها بعض الحروف.',
    en: 'Every letter has qualities that set it apart: five groups of opposites, of which each letter takes one from each, and seven single qualities that only some letters have.',
  },
  sections: [
    {
      body: {
        ar: 'الصفة هي الكيفية التي يخرج عليها الحرف من مخرجه: هل يجري معه النفس أم ينحبس؟ هل يجري الصوت أم ينقطع؟ هل يرتفع اللسان أم ينخفض؟ المخرج يحدد موضع الحرف، والصفات تميّز الحروف التي تشترك في مخرج واحد، كالتاء والطاء، والسين والصاد. وهي على المشهور (عند ابن الجزري) سبع عشرة صفة: خمس متضادة يأخذ كل حرف واحدة من كل زوج منها، وسبع لا ضد لها تختص بها بعض الحروف.',
        en: 'A quality (sifah, plural sifat) is the way a letter comes out of its makhraj: does the breath flow with it or stop? Does the sound run on or cut off? Does the tongue rise or stay low? The makhraj tells you where a letter is made; its qualities tell apart letters that share a makhraj, like ta and ṭa, or seen and ṣad. On the best-known count (that of Ibn al-Jazari) there are seventeen: five pairs of opposites, where every letter takes one quality from each pair, and seven single qualities that only some letters have.',
      },
    },
    {
      heading: { ar: 'الهمس والجهر: النَّفَس', en: 'Hams and jahr: the breath' },
      body: {
        ar: 'الهمس: جريان النفس مع الحرف، فيُسمع معه هواء خفيف. حروفه عشرة يجمعها قولك: «فَحَثَّهُ شَخْصٌ سَكَتْ». جرّب السين الساكنة: يستمر الهواء بعدها. الجهر ضده: انحباس النفس مع الحرف وقوة الصوت به، وحروفه التسعة عشر الباقية، مثل الزاي الساكنة: يقوى صوتها ولا يُسمع معها هواء كهواء السين. احرص على إظهار همس التاء والكاف دون مبالغة.',
        en: 'Hams (whisper): the breath flows with the letter, so a little air is heard with it. Its ten letters are gathered in the phrase "faḥaththahu shakhṣun sakat". Try a seen with a sukun: the air keeps going after it. Jahr (voiced) is the opposite: the breath is held back and the voice is strong. It has the other nineteen letters. A zay with a sukun, for example, buzzes with voice, with none of the breathy air of seen. Let the breath of ta and kaf be heard, without overdoing it.',
      },
      animation: 'sifat-hams-jahr',
    },
    {
      heading: { ar: 'الشدة والتوسط والرخاوة: الصوت', en: 'Shiddah, tawassut and rakhawah: the sound' },
      body: {
        ar: 'الشدة: انحباس الصوت عند مخرج الحرف إذا سكن، فلا يمكن مدّه. حروفها ثمانية: «أَجِدْ قَطٍ بَكَتْ»، كالباء في «أَبْ». الرخاوة ضدها: جريان الصوت مع الحرف، فيمكن مدّه، كالسين في «أَسْ»؛ وحروفها ستة عشر. وبينهما التوسط: لا ينحبس الصوت كله ولا يجري كله، وحروفه خمسة: «لِنْ عُمَرْ».',
        en: 'Shiddah (strength): when the letter has a sukun, its sound stops at the makhraj and cannot be drawn out. Its eight letters are gathered in the phrase "ajid qaṭin bakat", like the ba in "ab". Rakhawah (softness) is the opposite: the sound flows on with the letter and can be drawn out, like the seen in "as". It has sixteen letters. Between them is tawassut: the sound neither stops completely nor flows completely. Its five letters are gathered in the phrase "lin ʿumar".',
      },
      animation: 'sifat-shiddah-rakhawah',
    },
    {
      heading: { ar: 'الاستعلاء والاستفال: اللسان يرتفع أو ينخفض', en: 'Istiʿla and istifal: the tongue rises or stays low' },
      body: {
        ar: 'الاستعلاء: ارتفاع أقصى اللسان إلى الحنك عند النطق بالحرف، فيخرج مفخمًا. حروفه سبعة: «خُصَّ ضَغْطٍ قِظْ»، وهي حروف التفخيم. الاستفال ضده: انخفاض اللسان عن الحنك، فيخرج الحرف مرققًا، وحروفه الاثنان والعشرون الباقية. ومنها ما يُفخّم أحيانًا: الراء، ولام لفظ الجلالة بعد فتح أو ضم، والألف بعد حرف مفخم.',
        en: 'Istiʿla (raising): the back of the tongue rises toward the palate as the letter is said, so it comes out heavy (tafkhim). Its seven letters are gathered in the phrase "khuṣṣa ḍaghṭin qiẓ": these are the heavy letters. Istifal (lowering) is the opposite: the tongue stays low, so the letter comes out light. It has the other twenty-two letters. A few of these are made heavy at times: ra, the lam in the name of Allah after a fatha or a damma, and an alif after a heavy letter.',
      },
      animation: 'sifat-istila-istifal',
    },
    {
      heading: { ar: 'الإطباق والانفتاح: اللسان ينطبق على الحنك', en: 'Itbaq and infitah: the tongue seals against the palate' },
      body: {
        ar: 'الإطباق: انطباق اللسان على الحنك الأعلى وانحصار الصوت بينهما. حروفه أربعة: ص ض ط ظ، وهي أقوى حروف الاستعلاء تفخيمًا. الانفتاح ضده: يبقى بين اللسان والحنك فراغ يخرج منه الهواء، وحروفه الخمسة والعشرون الباقية. فالخاء والغين والقاف مستعلية لكنها منفتحة، فتفخيمها أقل من تفخيم حروف الإطباق.',
        en: 'Itbaq (sealing): the tongue presses up against the palate and the sound is enclosed between them. Its four letters, ص ض ط ظ, are the heaviest of the raised letters. Infitah (opening) is the opposite: a gap stays open between the tongue and the palate for the air. It has the other twenty-five letters. So kha, ghayn and qaf are raised but open, and less heavy than the sealed letters.',
      },
      animation: 'sifat-itbaq-infitah',
    },
    {
      heading: { ar: 'الإذلاق والإصمات: خفة الحرف', en: 'Idhlaq and ismat: how light the letter is' },
      body: {
        ar: 'الإذلاق: خفة الحرف وسرعة النطق به، لأنه يخرج من طرف اللسان أو من الشفتين. حروفه ستة: «فِرَّ مِنْ لُبٍّ». الإصمات ضده: ثقل الحرف لخروجه بعيدًا عن طرف اللسان والشفتين، وحروفه الثلاثة والعشرون الباقية. ولا تكاد تُبنى كلمة عربية من أربعة أصول أو خمسة إلا وفيها حرف من حروف الإذلاق. وهذه الصفة لا يتغير بها النطق، لكنها تبيّن سهولة الحرف.',
        en: 'Idhlaq (fluency): the letter is light and quick to say, because it comes from the tip of the tongue or the lips. Its six letters are gathered in the phrase "firra min lubb". Ismat (restraint) is the opposite: the letter is heavier to say, as it comes from away from the tip of the tongue and the lips. It has the other twenty-three letters. An Arabic root of four or five letters almost always holds at least one idhlaq letter. This pair does not change how you say a letter; it describes how easy it is.',
      },
      animation: 'sifat-idhlaq-ismat',
    },
    {
      heading: { ar: 'الصفير والقلقلة واللين', en: 'Safir, qalqalah and lin' },
      body: {
        ar: 'هذه صفات لا ضد لها. الصفير: صوت زائد يشبه صفير الطائر، يخرج مع الصاد والزاي والسين. القلقلة: اضطراب المخرج عند النطق بالحرف ساكنًا حتى تُسمع له نبرة، وحروفها «قُطْبُ جَدٍّ» (ولها درس خاص). اللين: خروج الحرف بسهولة بلا كلفة، وهو في الواو والياء الساكنتين بعد فتح.',
        en: 'These qualities have no opposite. Safir (whistle): an extra sound like a bird’s whistle that comes with ṣad, zay and seen. Qalqalah (echo): the makhraj is shaken as the letter is said with a sukun, so a small bounce is heard. Its letters are gathered in the phrase "quṭbu jadd" (it has its own lesson). Lin (ease): the letter comes out easily, without effort. It is in a waw or ya with a sukun after a fatha.',
      },
      animation: 'sifat-safir-qalqalah-lin',
    },
    {
      heading: {
        ar: 'الانحراف والتكرير والتفشي والاستطالة',
        en: 'Inhiraf, takrir, tafashshi and istitalah',
      },
      body: {
        ar: 'الانحراف: ميل الحرف بعد خروجه نحو مخرج غيره، وهو في اللام والراء. التكرير: قابلية طرف اللسان للارتعاد بالراء؛ نتعلّمه لنتجنّبه، فتُنطق الراء بطرقة واحدة ولا تُكرر، وخاصة المشددة. التفشي: انتشار الهواء في الفم مع الشين. الاستطالة: امتداد الصوت على حافة اللسان من أولها إلى آخرها مع الضاد، حتى يتصل بمخرج اللام، مع بقاء الضاد ضادًا لا تصير ظاءً ولا دالًا.',
        en: 'Inhiraf (leaning): after leaving its makhraj, the letter leans toward another one. It is in lam and ra. Takrir (repetition): the tip of the tongue tends to trill on ra. We learn it in order to avoid it: say ra with a single tap and never roll it, especially with a shaddah. Tafashshi (spreading): the air spreads through the mouth with sheen. Istitalah (lengthening): with ḍad, the sound stretches along the side of the tongue from its back to its front, reaching lam’s makhraj, while ḍad stays ḍad and never turns into ẓa or dal.',
      },
      animation: 'sifat-inhiraf-istitalah',
    },
    {
      heading: { ar: 'حروف من مخرج واحد', en: 'Letters from one makhraj' },
      body: {
        ar: 'اجمع صفات الحرف كلها تعرف كيف تنطقه: فالطاء مثلًا مجهورة شديدة مستعلية مطبقة مصمتة مقلقلة. والحروف التي تشترك في المخرج لا يميّز بينها إلا الصفات؛ فلولا الإطباق والاستعلاء لصارت الصاد سينًا، والظاء ذالًا.',
        en: 'Put all of a letter’s qualities together and you know how to say it: ṭa, for example, is voiced, strong, raised, sealed, restrained and has qalqalah. Letters that share a makhraj are told apart only by their qualities: without its raising and sealing, ṣad would turn into seen and ẓa into dhal.',
      },
      animation: 'sifat-compare',
    },
  ],
  // No lesson-level clip: each section plays its own. No rule is colored here (as in the
  // makharij unit): the notes point at letters and their qualities instead.
  focusRules: [],
  examples: [
    {
      verseKey: '114:5',
      note: {
        ar: 'السين الأولى في الكلمة الثانية ساكنة: اسمع الهمس (النفس يجري) والصفير معها. والصاد في الكلمة الرابعة فيها صفير أيضًا، لكنها مستعلية مطبقة، فتفخَّم بخلاف السين.',
        en: 'The first seen in the second word has a sukun: hear its hams (the breath flows) and its whistle (safir). The ṣad in the fourth word whistles too, but it is raised and sealed, so it is heavy where seen is light.',
      },
    },
    {
      verseKey: '113:5',
      note: {
        ar: 'السين في الكلمتين الثالثة والخامسة رخوة يجري معها الصوت. وعند الوقف على آخر الآية تسكن الدال، فينحبس الصوت عند مخرجها (الشدة) ثم تُسمع القلقلة.',
        en: 'The seen in the third and fifth words is soft: its sound flows on. Stopping at the end of the ayah gives the last dal a sukun, so its sound stops at the makhraj (shiddah) and then bounces (qalqalah).',
      },
    },
    {
      verseKey: '1:6',
      note: {
        ar: 'الصاد والطاء في الكلمة الثانية مستعليتان مطبقتان: أقوى التفخيم. وفي الكلمة الأخيرة: السين الساكنة مستفلة مهموسة، والقاف مستعلية منفتحة، فتفخيمها دون تفخيم الطاء.',
        en: 'The ṣad and ṭa in the second word are raised and sealed: the heaviest letters. In the last word, the seen with a sukun is low and whispered, while the qaf is raised but open, so it is less heavy than the ṭa.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'في الكلمة السادسة غين ساكنة مستعلية، بعدها ضاد. والضاد المشددة في الكلمة الأخيرة: اسمع الاستطالة، يمتد صوتها على حافة اللسان.',
        en: 'In the sixth word, a raised ghayn with a sukun comes before a ḍad. In the last word, listen to the ḍad with shaddah: its sound stretches along the side of the tongue (istitalah).',
      },
    },
    {
      verseKey: '108:1',
      note: {
        ar: 'الطاء في الكلمة الثانية مطبقة مفخمة. والكاف في آخر الكلمة الثانية وأول الثالثة شديدة مهموسة: ينقطع صوتها ويُسمع معها نفس خفيف. والواو الساكنة بعد فتح في الكلمة الثالثة حرف لين، والثاء بعدها مهموسة رخوة.',
        en: 'The ṭa in the second word is sealed and heavy. The kaf at the end of the second word and at the start of the third is strong and whispered: its sound stops, with a light breath after it. The waw with a sukun after a fatha in the third word is a lin letter, and the tha after it is whispered and soft.',
      },
    },
    {
      verseKey: '106:4',
      note: {
        ar: 'الطاء الساكنة في الكلمة الثانية: مطبقة مستعلية مقلقلة. والواو الساكنة بعد فتح في الكلمة الأخيرة حرف لين، تخرج بسهولة، وقبلها خاء مستعلية.',
        en: 'The ṭa with a sukun in the second word is sealed, raised and has qalqalah. The waw with a sukun after a fatha in the last word is a lin letter that comes out easily, after a raised kha.',
      },
    },
    {
      verseKey: '108:2',
      note: {
        ar: 'اللام المشددة في الكلمة الأولى فيها انحراف. وعند الوقف على الراء في آخر الآية: طرقة واحدة بلا تكرير.',
        en: 'The lam with shaddah in the first word has inhiraf (its sound leans). When you stop on the ra at the end of the ayah, give it a single tap, without trilling (takrir).',
      },
    },
    {
      verseKey: '113:2',
      note: {
        ar: 'الشين في الكلمة الثانية: انتشار الهواء في الفم (التفشي). والخاء في الكلمة الأخيرة مستعلية مهموسة، والقاف في آخرها شديدة مقلقلة عند الوقف.',
        en: 'The sheen in the second word: the air spreads through the mouth (tafashshi). In the last word, the kha is raised and whispered, and the qaf at its end is strong, with qalqalah when you stop on it.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 20,
        note: {
          ar: 'أول باب الصفات: يذكر الصفات الخمس الغالبة (الجهر والرخاوة والاستفال والانفتاح والإصمات)، ثم يقول: وقل أضدادها (الهمس والشدة والاستعلاء والإطباق والإذلاق).',
          en: 'The opening line of the chapter on qualities: it names five (jahr, rakhawah, istifal, infitah, ismat), then says to name their opposites too (hams, shiddah, istiʿla, itbaq, idhlaq).',
        },
      },
      {
        from: 21,
        to: 23,
        note: {
          ar: 'حروف كل صفة من الصفات المتضادة: المهموسة «فحثه شخص سكت»، والشديدة «أجد قط بكت»، والمتوسطة «لن عمر»، والمستعلية «خص ضغط قظ»، والمطبقة ص ض ط ظ، والمذلقة «فر من لب». وما بقي فللضد.',
          en: 'The letters of each opposite quality: hams in "faḥaththahu shakhṣun sakat", shiddah in "ajid qaṭin bakat", tawassut in "lin ʿumar", istiʿla in "khuṣṣa ḍaghṭin qiẓ", itbaq in ṣad, ḍad, ṭa and ẓa, and idhlaq in "firra min lubb". The rest of the letters have the opposite quality.',
        },
      },
      {
        from: 24,
        to: 26,
        note: {
          ar: 'الصفات التي لا ضد لها: الصفير في الصاد والزاي والسين، والقلقلة في «قطب جد»، واللين في الواو والياء الساكنتين بعد فتح، والانحراف في اللام والراء، والتكرير في الراء، والتفشي في الشين، والاستطالة في الضاد.',
          en: 'The qualities with no opposite: safir in ṣad, zay and seen; qalqalah in "quṭbu jadd"; lin in waw and ya with a sukun after a fatha; inhiraf in lam and ra; takrir in ra; tafashshi in sheen; and istitalah in ḍad.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ما حروف الهمس؟', en: 'Which letters have hams (whisper)?' },
      options: [
        { ar: 'فحثه شخص سكت', en: 'فحثه شخص سكت' },
        { ar: 'أجد قط بكت', en: 'أجد قط بكت' },
        { ar: 'خص ضغط قظ', en: 'خص ضغط قظ' },
        { ar: 'فر من لب', en: 'فر من لب' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حروف الهمس عشرة: «فَحَثَّهُ شَخْصٌ سَكَتْ». الثانية حروف الشدة، والثالثة حروف الاستعلاء، والرابعة حروف الإذلاق.',
        en: 'The ten hams letters are "faḥaththahu shakhṣun sakat". The others are the shiddah, istiʿla and idhlaq letters.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الذي يحدث في صفة الشدة؟', en: 'What happens with shiddah (strength)?' },
      options: [
        { ar: 'ينحبس الصوت عند المخرج', en: 'The sound stops at the makhraj' },
        { ar: 'يجري الصوت مع الحرف', en: 'The sound flows on with the letter' },
        { ar: 'يرتفع أقصى اللسان', en: 'The back of the tongue rises' },
        { ar: 'ينتشر الهواء في الفم', en: 'The air spreads through the mouth' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الشدة انحباس الصوت عند مخرج الحرف الساكن، كالباء في «أَبْ». وجريان الصوت هو الرخاوة.',
        en: 'In shiddah the sound of a letter with a sukun stops at its makhraj, like the ba in "ab". A flowing sound is rakhawah.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي هذه الحروف مطبقة؟', en: 'Which of these letters are sealed (itbaq)?' },
      options: [
        { ar: 'خ غ ق', en: 'خ غ ق' },
        { ar: 'ص ض ط ظ', en: 'ص ض ط ظ' },
        { ar: 'ص ز س', en: 'ص ز س' },
        { ar: 'ل ن ر', en: 'ل ن ر' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'حروف الإطباق أربعة: ص ض ط ظ. والخاء والغين والقاف مستعلية لكنها منفتحة.',
        en: 'The four sealed letters are ṣad, ḍad, ṭa and ẓa. Kha, ghayn and qaf are raised but open.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الصفة التي يجب تجنّب المبالغة فيها في الراء؟', en: 'Which quality of ra should you avoid overdoing?' },
      options: [
        { ar: 'التكرير', en: 'Takrir (repetition)' },
        { ar: 'الصفير', en: 'Safir (whistle)' },
        { ar: 'التفشي', en: 'Tafashshi (spreading)' },
        { ar: 'الاستطالة', en: 'Istitalah (lengthening)' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'التكرير في الراء يُعرف ليُجتنب: تُنطق بطرقة واحدة دون ارتعاد اللسان.',
        en: 'Takrir is learned in order to avoid it: ra gets a single tap, without the tongue trilling.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الحرف الذي فيه صفة الاستطالة؟', en: 'Which letter has istitalah (lengthening)?' },
      options: [
        { ar: 'الشين', en: 'Sheen' },
        { ar: 'الضاد', en: 'Ḍad' },
        { ar: 'اللام', en: 'Lam' },
        { ar: 'الظاء', en: 'Ẓa' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الاستطالة في الضاد وحدها: يمتد صوتها على حافة اللسان. والتفشي في الشين.',
        en: 'Only ḍad has istitalah: its sound stretches along the side of the tongue. Sheen has tafashshi.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'بمَ تتميز الصاد عن السين، ومخرجهما واحد؟',
        en: 'Ṣad and seen share one makhraj. What sets ṣad apart?',
      },
      options: [
        { ar: 'الاستعلاء والإطباق', en: 'Istiʿla and itbaq (raised and sealed)' },
        { ar: 'الهمس والرخاوة', en: 'Hams and rakhawah (whispered and soft)' },
        { ar: 'الصفير', en: 'Safir (whistle)' },
        { ar: 'القلقلة', en: 'Qalqalah (echo)' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'كلتاهما مهموسة رخوة فيها صفير، لكن الصاد مستعلية مطبقة، والسين مستفلة منفتحة.',
        en: 'Both are whispered, soft and whistling, but ṣad is raised and sealed while seen is low and open.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى تكون الواو حرف لين؟', en: 'When is waw a lin letter?' },
      options: [
        { ar: 'إذا سكنت وقبلها فتح', en: 'When it has a sukun after a fatha' },
        { ar: 'إذا سكنت وقبلها ضم', en: 'When it has a sukun after a damma' },
        { ar: 'إذا كانت مشددة', en: 'When it has a shaddah' },
        { ar: 'إذا كانت في أول الكلمة', en: 'When it starts a word' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'اللين في الواو والياء الساكنتين بعد فتح. أما الواو الساكنة بعد ضم فحرف مد.',
        en: 'Lin is in a waw or ya with a sukun after a fatha. A waw with a sukun after a damma is a madd letter.',
      },
    },
  ],
  reviewed: false,
}
