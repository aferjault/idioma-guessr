// Métadonnées des langues du jeu IdiomaGuessr
// Les phrases sont récupérées dynamiquement via l'API Tatoeba (tatoebaService.ts)
// Les phrases de fallback sont utilisées uniquement si l'API est indisponible

export interface Phrase {
  id: string;
  text: string;
  translation: string;    // Traduction française de la phrase
  language: string;
  languageCode: string;   // BCP-47 (pour la synthèse vocale Web Speech API)
  flag: string;
  hint?: string;          // Zone géographique (indice à 3/5)
  languageFamily?: string; // Famille linguistique (indice à 4/5)
}

export interface LanguageMeta {
  language: string;
  languageCode: string;   // BCP-47
  tatoebaCode: string;    // ISO 639-3 (code utilisé par l'API Tatoeba)
  flag: string;
  hint?: string;
  languageFamily?: string;
  fallback: {             // Phrase statique de secours si l'API échoue
    text: string;
    translation: string;
  };
}

export const LANGUAGE_META: LanguageMeta[] = [
  {
    language: "Français", languageCode: "fr-FR", tatoebaCode: "fra", flag: "🇫🇷",
    hint: "Europe de l'Ouest", languageFamily: "Langues romanes",
    fallback: { text: "Le soleil brille doucement sur les toits de la vieille ville", translation: "Le soleil brille doucement sur les toits de la vieille ville" },
  },
  {
    language: "Espagnol", languageCode: "es-ES", tatoebaCode: "spa", flag: "🇪🇸",
    hint: "Europe du Sud / Amérique latine", languageFamily: "Langues romanes",
    fallback: { text: "El viento sopla con fuerza entre las ramas de los árboles", translation: "Le vent souffle fort entre les branches des arbres" },
  },
  {
    language: "Portugais", languageCode: "pt-PT", tatoebaCode: "por", flag: "🇵🇹",
    hint: "Europe de l'Ouest / Amérique du Sud", languageFamily: "Langues romanes",
    fallback: { text: "As ondas do mar batem nas rochas com grande intensidade", translation: "Les vagues de la mer frappent les rochers avec une grande intensité" },
  },
  {
    language: "Italien", languageCode: "it-IT", tatoebaCode: "ita", flag: "🇮🇹",
    hint: "Europe du Sud", languageFamily: "Langues romanes",
    fallback: { text: "Il cielo si tinge di rosso e arancione quando tramonta il sole", translation: "Le ciel se teinte de rouge et d'orange au coucher du soleil" },
  },
  {
    language: "Allemand", languageCode: "de-DE", tatoebaCode: "deu", flag: "🇩🇪",
    hint: "Europe centrale", languageFamily: "Langues germaniques",
    fallback: { text: "Die Berge im Süden des Landes sind im Winter schneebedeckt", translation: "Les montagnes du sud du pays sont enneigées en hiver" },
  },
  {
    language: "Néerlandais", languageCode: "nl-NL", tatoebaCode: "nld", flag: "🇳🇱",
    hint: "Europe du Nord-Ouest", languageFamily: "Langues germaniques",
    fallback: { text: "De fietsen staan langs het kanaal in het centrum van de stad", translation: "Les vélos sont garés le long du canal au centre de la ville" },
  },
  {
    language: "Polonais", languageCode: "pl-PL", tatoebaCode: "pol", flag: "🇵🇱",
    hint: "Europe centrale", languageFamily: "Langues slaves",
    fallback: { text: "Jesień w górach jest bardzo kolorowa i pełna pięknych liści", translation: "L'automne à la montagne est très coloré et plein de belles feuilles" },
  },
  {
    language: "Russe", languageCode: "ru-RU", tatoebaCode: "rus", flag: "🇷🇺",
    hint: "Europe de l'Est / Asie", languageFamily: "Langues slaves",
    fallback: { text: "Зима в лесу очень холодная и долгая но невероятно красивая", translation: "L'hiver en forêt est très froid et long, mais incroyablement beau" },
  },
  {
    language: "Chinois (Mandarin)", languageCode: "zh-CN", tatoebaCode: "cmn", flag: "🇨🇳",
    hint: "Asie de l'Est", languageFamily: "Langues sino-tibétaines",
    fallback: { text: "春天的花朵在微风中轻轻摇曳，散发出迷人的芬芳", translation: "Les fleurs du printemps se balancent doucement dans la brise et dégagent un parfum envoûtant" },
  },
  {
    language: "Japonais", languageCode: "ja-JP", tatoebaCode: "jpn", flag: "🇯🇵",
    hint: "Asie de l'Est", languageFamily: "Langues japono-ryukyuanes",
    fallback: { text: "桜の花が風に舞い散る春の夕暮れは本当に美しい", translation: "Le crépuscule de printemps où les fleurs de cerisier tourbillonnent dans le vent est vraiment magnifique" },
  },
  {
    language: "Coréen", languageCode: "ko-KR", tatoebaCode: "kor", flag: "🇰🇷",
    hint: "Asie de l'Est", languageFamily: "Langue isolée",
    fallback: { text: "도시의 거리는 밤에도 환하게 빛나며 많은 사람들로 붐빕니다", translation: "Les rues de la ville brillent même la nuit et fourmillent de monde" },
  },
  {
    language: "Arabe", languageCode: "ar-SA", tatoebaCode: "ara", flag: "🇸🇦",
    hint: "Moyen-Orient / Afrique du Nord", languageFamily: "Langues sémitiques",
    fallback: { text: "الصحراء الكبرى هي أكبر صحراء حارة في العالم وتمتد عبر قارة أفريقيا", translation: "Le Sahara est le plus grand désert chaud du monde et s'étend sur tout le continent africain" },
  },
  {
    language: "Turc", languageCode: "tr-TR", tatoebaCode: "tur", flag: "🇹🇷",
    hint: "Europe / Asie", languageFamily: "Langues turques",
    fallback: { text: "Bahçedeki çiçekler ilkbaharda rengarenk açar ve güzel kokar", translation: "Les fleurs du jardin s'épanouissent en couleurs au printemps et sentent bon" },
  },
  {
    language: "Suédois", languageCode: "sv-SE", tatoebaCode: "swe", flag: "🇸🇪",
    hint: "Scandinavie", languageFamily: "Langues germaniques",
    fallback: { text: "Skogen är full av tysta stigar och vackra sjöar på sommaren", translation: "La forêt est pleine de sentiers silencieux et de beaux lacs en été" },
  },
  {
    language: "Danois", languageCode: "da-DK", tatoebaCode: "dan", flag: "🇩🇰",
    hint: "Scandinavie", languageFamily: "Langues germaniques",
    fallback: { text: "Havet bringer ro og stilhed når bølgerne skyller ind over stranden", translation: "La mer apporte calme et sérénité quand les vagues déferlent sur la plage" },
  },
  {
    language: "Finnois", languageCode: "fi-FI", tatoebaCode: "fin", flag: "🇫🇮",
    hint: "Europe du Nord", languageFamily: "Langues finno-ougriennes",
    fallback: { text: "Järven rannalla istuminen hiljaisena iltana tuntuu rauhoittavalta", translation: "S'asseoir au bord d'un lac lors d'une soirée calme est une expérience apaisante" },
  },
  {
    language: "Grec", languageCode: "el-GR", tatoebaCode: "ell", flag: "🇬🇷",
    hint: "Europe du Sud", languageFamily: "Langues helléniques",
    fallback: { text: "Τα κύματα της θάλασσας χτυπούν τα βράχια με δύναμη το χειμώνα", translation: "Les vagues de la mer frappent les rochers avec force en hiver" },
  },
  {
    language: "Hindi", languageCode: "hi-IN", tatoebaCode: "hin", flag: "🇮🇳",
    hint: "Asie du Sud", languageFamily: "Langues indo-iraniennes",
    fallback: { text: "बारिश के बाद मिट्टी की सुगंध बहुत ताजगी भरी और मनमोहक होती है", translation: "Le parfum de la terre après la pluie est très frais et envoûtant" },
  },
  {
    language: "Indonésien", languageCode: "id-ID", tatoebaCode: "ind", flag: "🇮🇩",
    hint: "Asie du Sud-Est", languageFamily: "Langues austronésiennes",
    fallback: { text: "Hujan turun deras di malam hari dan membuat udara terasa sejuk dan segar", translation: "La pluie tombe fort la nuit et rend l'air frais et vivifiant" },
  },
  {
    language: "Anglais", languageCode: "en-GB", tatoebaCode: "eng", flag: "🇬🇧",
    hint: "Europe / Amérique du Nord", languageFamily: "Langues germaniques",
    fallback: { text: "The sun is slowly setting behind the old lighthouse at the edge of the cliff", translation: "Le soleil se couche lentement derrière le vieux phare au bord de la falaise" },
  },
  {
    language: "Filipino", languageCode: "tl-PH", tatoebaCode: "tgl", flag: "🇵🇭",
    hint: "Asie du Sud-Est", languageFamily: "Langues austronésiennes",
    fallback: { text: "Ang mga bulaklak sa hardin ay namumukadkad tuwing tag-sibol", translation: "Les fleurs du jardin s'épanouissent à chaque printemps" },
  },
  {
    language: "Bulgare", languageCode: "bg-BG", tatoebaCode: "bul", flag: "🇧🇬",
    hint: "Europe du Sud-Est", languageFamily: "Langues slaves",
    fallback: { text: "Слънцето изгрява над планините и осветява цялата долина", translation: "Le soleil se lève au-dessus des montagnes et illumine toute la vallée" },
  },
  {
    language: "Roumain", languageCode: "ro-RO", tatoebaCode: "ron", flag: "🇷🇴",
    hint: "Europe de l'Est", languageFamily: "Langues romanes",
    fallback: { text: "Soarele răsare dincolo de dealuri și luminează întreaga vale", translation: "Le soleil se lève derrière les collines et illumine toute la vallée" },
  },
  {
    language: "Tchèque", languageCode: "cs-CZ", tatoebaCode: "ces", flag: "🇨🇿",
    hint: "Europe centrale", languageFamily: "Langues slaves",
    fallback: { text: "Sluneční paprsky pronikají přes listy stromů a osvětlují cestu", translation: "Les rayons du soleil traversent les feuilles des arbres et éclairent le chemin" },
  },
  {
    language: "Croate", languageCode: "hr-HR", tatoebaCode: "hrv", flag: "🇭🇷",
    hint: "Europe du Sud-Est", languageFamily: "Langues slaves",
    fallback: { text: "Sunce zalazi iza otoka i nebo se boji crvenom i narančastom bojom", translation: "Le soleil se couche derrière les îles et le ciel se teinte de rouge et d'orange" },
  },
  {
    language: "Malais", languageCode: "ms-MY", tatoebaCode: "zsm", flag: "🇲🇾",
    hint: "Asie du Sud-Est", languageFamily: "Langues austronésiennes",
    fallback: { text: "Matahari terbit di sebalik bukit dan menerangi seluruh kampung", translation: "Le soleil se lève derrière la colline et illumine tout le village" },
  },
  {
    language: "Slovaque", languageCode: "sk-SK", tatoebaCode: "slk", flag: "🇸🇰",
    hint: "Europe centrale", languageFamily: "Langues slaves",
    fallback: { text: "Slnko vychádza nad horami a osvetľuje celé údolie", translation: "Le soleil se lève au-dessus des montagnes et illumine toute la vallée" },
  },
  {
    language: "Tamoul", languageCode: "ta-IN", tatoebaCode: "tam", flag: "🇮🇳",
    hint: "Asie du Sud", languageFamily: "Langues dravidiennes",
    fallback: { text: "காலை சூரியன் மலை உச்சியில் தோன்றி பள்ளத்தாக்கை ஒளிரச் செய்கிறது", translation: "Le soleil matinal apparaît au sommet de la montagne et illumine la vallée" },
  },
  {
    language: "Ukrainien", languageCode: "uk-UA", tatoebaCode: "ukr", flag: "🇺🇦",
    hint: "Europe de l'Est", languageFamily: "Langues slaves",
    fallback: { text: "Сонце встає над горизонтом і освітлює поля золотим світлом", translation: "Le soleil se lève à l'horizon et illumine les champs d'une lumière dorée" },
  },
  // --- Nouvelles langues eleven_v3 ---
  {
    language: "Norvégien", languageCode: "nb-NO", tatoebaCode: "nob", flag: "🇳🇴",
    hint: "Scandinavie", languageFamily: "Langues germaniques",
    fallback: { text: "Fjordene er svært vakre om sommeren med det klare vannet", translation: "Les fjords sont très beaux en été avec l'eau claire" },
  },
  {
    language: "Hongrois", languageCode: "hu-HU", tatoebaCode: "hun", flag: "🇭🇺",
    hint: "Europe centrale", languageFamily: "Langues finno-ougriennes",
    fallback: { text: "A folyó partján sétálni nagyon kellemes és pihentető", translation: "Se promener le long de la rivière est très agréable et reposant" },
  },
  {
    language: "Lituanien", languageCode: "lt-LT", tatoebaCode: "lit", flag: "🇱🇹",
    hint: "Europe du Nord", languageFamily: "Langues baltes",
    fallback: { text: "Ruduo miške yra labai gražus kai lapai keičia spalvas", translation: "L'automne en forêt est très beau quand les feuilles changent de couleur" },
  },
  {
    language: "Letton", languageCode: "lv-LV", tatoebaCode: "lav", flag: "🇱🇻",
    hint: "Europe du Nord", languageFamily: "Langues baltes",
    fallback: { text: "Meži klāj lielu daļu valsts un ir pilni ar savvaļas dzīvniekiem", translation: "Les forêts couvrent une grande partie du pays et sont pleines d'animaux sauvages" },
  },
  {
    language: "Estonien", languageCode: "et-EE", tatoebaCode: "est", flag: "🇪🇪",
    hint: "Europe du Nord", languageFamily: "Langues finno-ougriennes",
    fallback: { text: "Meri on talvel külm aga suvel saab seal ujuda", translation: "La mer est froide en hiver mais on peut y nager en été" },
  },
  {
    language: "Serbe", languageCode: "sr-RS", tatoebaCode: "srp", flag: "🇷🇸",
    hint: "Europe du Sud-Est", languageFamily: "Langues slaves",
    fallback: { text: "Зима у планинама доноси много снега и хладног ваздуха", translation: "L'hiver dans les montagnes apporte beaucoup de neige et d'air froid" },
  },
  {
    language: "Slovène", languageCode: "sl-SI", tatoebaCode: "slv", flag: "🇸🇮",
    hint: "Europe centrale", languageFamily: "Langues slaves",
    fallback: { text: "Pomlad prinese lepe cvetove in toplo sonce na vrtove", translation: "Le printemps apporte de belles fleurs et un soleil chaud dans les jardins" },
  },
  {
    language: "Catalan", languageCode: "ca-ES", tatoebaCode: "cat", flag: "🏴󠁥󠁳󠁣󠁴󠁿",
    hint: "Europe du Sud", languageFamily: "Langues romanes",
    fallback: { text: "El cel és molt blau quan el sol brilla sobre la mar", translation: "Le ciel est très bleu quand le soleil brille sur la mer" },
  },
  {
    language: "Macédonien", languageCode: "mk-MK", tatoebaCode: "mkd", flag: "🇲🇰",
    hint: "Europe du Sud-Est", languageFamily: "Langues slaves",
    fallback: { text: "Дрвјата цутат во пролет и ги красат улиците на градот", translation: "Les arbres fleurissent au printemps et ornent les rues de la ville" },
  },
  {
    language: "Islandais", languageCode: "is-IS", tatoebaCode: "isl", flag: "🇮🇸",
    hint: "Scandinavie", languageFamily: "Langues germaniques",
    fallback: { text: "Náttúran er mjög falleg um sumarið þegar sólin skín", translation: "La nature est très belle en été quand le soleil brille" },
  },
  {
    language: "Galicien", languageCode: "gl-ES", tatoebaCode: "glg", flag: "🏴󠁥󠁳󠁧󠁡󠁿",
    hint: "Europe du Sud", languageFamily: "Langues romanes",
    fallback: { text: "A chuvia cae sobre os campos verdes e os ríos enchen", translation: "La pluie tombe sur les champs verts et les rivières se remplissent" },
  },
  {
    language: "Irlandais", languageCode: "ga-IE", tatoebaCode: "gle", flag: "🇮🇪",
    hint: "Europe du Nord-Ouest", languageFamily: "Langues celtiques",
    fallback: { text: "Tá an ghrian ag taitneamh go hálainn os cionn na farraige", translation: "Le soleil brille magnifiquement au-dessus de la mer" },
  },
  {
    language: "Gallois", languageCode: "cy-GB", tatoebaCode: "cym", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    hint: "Europe du Nord-Ouest", languageFamily: "Langues celtiques",
    fallback: { text: "Mae'r mynyddoedd yn brydferth iawn yn y gwanwyn pan fo'r eira'n toddi", translation: "Les montagnes sont très belles au printemps quand la neige fond" },
  },
  {
    language: "Bosnien", languageCode: "bs-BA", tatoebaCode: "bos", flag: "🇧🇦",
    hint: "Europe du Sud-Est", languageFamily: "Langues slaves",
    fallback: { text: "Rijeka teče polako kroz dolinu i odražava nebo iznad nje", translation: "La rivière coule lentement à travers la vallée et reflète le ciel au-dessus" },
  },
  {
    language: "Hébreu", languageCode: "he-IL", tatoebaCode: "heb", flag: "🇮🇱",
    hint: "Moyen-Orient", languageFamily: "Langues sémitiques",
    fallback: { text: "השמש שוקעת מאחורי ההרים וצובעת את השמיים בצבעים יפים", translation: "Le soleil se couche derrière les montagnes et peint le ciel de belles couleurs" },
  },
  {
    language: "Persan", languageCode: "fa-IR", tatoebaCode: "pes", flag: "🇮🇷",
    hint: "Moyen-Orient", languageFamily: "Langues indo-iraniennes",
    fallback: { text: "بهار فصل زیبایی است که گل‌ها شکوفا می‌شوند و هوا دلپذیر می‌شود", translation: "Le printemps est une belle saison où les fleurs s'épanouissent et l'air devient agréable" },
  },
  {
    language: "Azerbaïdjanais", languageCode: "az-AZ", tatoebaCode: "aze", flag: "🇦🇿",
    hint: "Caucase", languageFamily: "Langues turques",
    fallback: { text: "Dağlar qışda qar ilə örtülür və çox gözəl görünür", translation: "Les montagnes sont couvertes de neige en hiver et semblent très belles" },
  },
  {
    language: "Kazakh", languageCode: "kk-KZ", tatoebaCode: "kaz", flag: "🇰🇿",
    hint: "Asie centrale", languageFamily: "Langues turques",
    fallback: { text: "Дала жазда жасыл болады және гүлдермен безендіреді", translation: "Les steppes sont vertes en été et se parent de fleurs" },
  },
  {
    language: "Géorgien", languageCode: "ka-GE", tatoebaCode: "kat", flag: "🇬🇪",
    hint: "Caucase", languageFamily: "Langues kartvéliennes",
    fallback: { text: "მთები ზამთარში თოვლით იფარება და ძალიან ლამაზია", translation: "Les montagnes se couvrent de neige en hiver et sont très belles" },
  },
  {
    language: "Arménien", languageCode: "hy-AM", tatoebaCode: "hye", flag: "🇦🇲",
    hint: "Caucase", languageFamily: "Langues arméniennes",
    fallback: { text: "Գարնանը ծառերը ծաղկում են և հովիտները կանաչ են", translation: "Au printemps les arbres fleurissent et les vallées sont vertes" },
  },
  {
    language: "Vietnamien", languageCode: "vi-VN", tatoebaCode: "vie", flag: "🇻🇳",
    hint: "Asie du Sud-Est", languageFamily: "Langues austroasiatiques",
    fallback: { text: "Mùa xuân hoa nở rực rỡ khắp nơi trên những con đường", translation: "Au printemps les fleurs s'épanouissent partout le long des routes" },
  },
  {
    language: "Thaï", languageCode: "th-TH", tatoebaCode: "tha", flag: "🇹🇭",
    hint: "Asie du Sud-Est", languageFamily: "Langues taï-kadaï",
    fallback: { text: "ดวงอาทิตย์ตกดินสาดแสงสีทองลงบนทุ่งนาในตอนเย็น", translation: "Le soleil couchant répand une lumière dorée sur les rizières le soir" },
  },
  {
    language: "Bengali", languageCode: "bn-BD", tatoebaCode: "ben", flag: "🇧🇩",
    hint: "Asie du Sud", languageFamily: "Langues indo-iraniennes",
    fallback: { text: "বর্ষাকালে নদীগুলো পানিতে পরিপূর্ণ হয় এবং চারদিক সবুজ হয়", translation: "Pendant la mousson les rivières se remplissent d'eau et tout devient vert" },
  },
  {
    language: "Ourdou", languageCode: "ur-PK", tatoebaCode: "urd", flag: "🇵🇰",
    hint: "Asie du Sud", languageFamily: "Langues indo-iraniennes",
    fallback: { text: "بارش کے بعد زمین سے ایک خوشبو اٹھتی ہے جو دل کو خوش کر دیتی ہے", translation: "Après la pluie, un parfum s'élève de la terre qui réjouit le cœur" },
  },
  {
    language: "Swahili", languageCode: "sw-KE", tatoebaCode: "swh", flag: "🇰🇪",
    hint: "Afrique de l'Est", languageFamily: "Langues bantoues",
    fallback: { text: "Mvua inanyesha kwa nguvu na mto unajaa maji mazuri", translation: "La pluie tombe fort et la rivière se remplit d'eau fraîche" },
  },
  {
    language: "Afrikaans", languageCode: "af-ZA", tatoebaCode: "afr", flag: "🇿🇦",
    hint: "Afrique du Sud", languageFamily: "Langues germaniques",
    fallback: { text: "Die berg is bedek met sneeu in die winter en lyk baie mooi", translation: "La montagne est couverte de neige en hiver et semble très belle" },
  },
  {
    language: "Biélorusse", languageCode: "be-BY", tatoebaCode: "bel", flag: "🇧🇾",
    hint: "Europe de l'Est", languageFamily: "Langues slaves",
    fallback: { text: "Лес вясной зелянее і напаўняецца спевамі птушак", translation: "La forêt verdit au printemps et se remplit de chants d'oiseaux" },
  },
];

// Liste de toutes les langues pour l'autocomplétion du champ de saisie
export const ALL_LANGUAGES = LANGUAGE_META.map(({ language, flag, languageCode }) => ({
  language,
  flag,
  languageCode,
}));
