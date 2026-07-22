// Official 2026 World Cup 48 Teams Database (Official Group Draw A to L)
const TEAMS_DATA = [
  // Group A
  {
    id: "mexico",
    name: "墨西哥 (Mexico)",
    group: "A",
    elo: 1780,
    continent: "North America",
    isHost: true,
    players: [
      { id: "gimenez", name: "圣地亚哥·希门尼斯 (Santiago Giménez)", stars: 3, pos: "FW", status: "fit" },
      { id: "alvarez", name: "埃德森·阿尔瓦雷斯 (Edson Álvarez)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "south_africa",
    name: "南非 (South Africa)",
    group: "A",
    elo: 1670,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "tau", name: "珀西·陶 (Percy Tau)", stars: 2, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "south_korea",
    name: "韩国 (South Korea)",
    group: "A",
    elo: 1760,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "son", name: "孙兴慜 (Heung-min Son)", stars: 4, pos: "FW", status: "fit" },
      { id: "kim", name: "金玟哉 (Min-jae Kim)", stars: 4, pos: "DF", status: "fit" },
      { id: "lee", name: "李刚仁 (Kang-in Lee)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "czechia",
    name: "捷克 (Czechia)",
    group: "A",
    elo: 1780,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "schick", name: "帕特里克·希克 (Patrik Schick)", stars: 3, pos: "FW", status: "fit" },
      { id: "soucek", name: "托马斯·绍切克 (Tomáš Souček)", stars: 3, pos: "MF", status: "fit" }
    ]
  },

  // Group B
  {
    id: "canada",
    name: "加拿大 (Canada)",
    group: "B",
    elo: 1760,
    continent: "North America",
    isHost: true,
    players: [
      { id: "davies", name: "阿方索·戴维斯 (Alphonso Davies)", stars: 4, pos: "DF", status: "fit" },
      { id: "david", name: "乔纳森·戴维 (Jonathan David)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "bosnia",
    name: "波黑 (Bosnia & Herzegovina)",
    group: "B",
    elo: 1680,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "dzeko", name: "埃丁·哲科 (Edin Džeko)", stars: 2, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "qatar",
    name: "卡塔尔 (Qatar)",
    group: "B",
    elo: 1650,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "afif", name: "阿克拉姆·阿菲夫 (Akram Afif)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "switzerland",
    name: "瑞士 (Switzerland)",
    group: "B",
    elo: 1860,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "xhaka", name: "格兰尼特·扎卡 (Granit Xhaka)", stars: 4, pos: "MF", status: "fit" },
      { id: "kobel", name: "格雷戈·科贝尔 (Gregor Kobel)", stars: 4, pos: "GK", status: "fit" }
    ]
  },

  // Group C
  {
    id: "brazil",
    name: "巴西 (Brazil)",
    group: "C",
    elo: 2060,
    continent: "South America",
    isHost: false,
    players: [
      { id: "vinicius", name: "维尼修斯·儒尼奥尔 (Vinícius Júnior)", stars: 5, pos: "FW", status: "fit" },
      { id: "rodrygo", name: "罗德里戈 (Rodrygo)", stars: 4, pos: "FW", status: "fit" },
      { id: "guimaraes", name: "布鲁诺·吉马良斯 (Bruno Guimarães)", stars: 4, pos: "MF", status: "fit" },
      { id: "marquinhos", name: "马尔基尼奥斯 (Marquinhos)", stars: 4, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "morocco",
    name: "摩洛哥 (Morocco)",
    group: "C",
    elo: 1880,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "hakimi", name: "阿什拉夫·哈基米 (Achraf Hakimi)", stars: 4, pos: "DF", status: "fit" },
      { id: "diaz_b", name: "布拉欣·迪亚斯 (Brahim Díaz)", stars: 4, pos: "MF", status: "fit" },
      { id: "bono", name: "亚辛·布努 (Yassine Bounou)", stars: 3, pos: "GK", status: "fit" }
    ]
  },
  {
    id: "haiti",
    name: "海地 (Haiti)",
    group: "C",
    elo: 1520,
    continent: "North America",
    isHost: false,
    players: [
      { id: "nazon", name: "杜肯斯·纳宗 (Duckens Nazon)", stars: 1, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "scotland",
    name: "苏格兰 (Scotland)",
    group: "C",
    elo: 1730,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "robertson", name: "安德鲁·罗伯逊 (Andrew Robertson)", stars: 4, pos: "DF", status: "fit" },
      { id: "mctominay", name: "斯科特·麦克托米奈 (Scott McTominay)", stars: 3, pos: "MF", status: "fit" }
    ]
  },

  // Group D
  {
    id: "usa",
    name: "美国 (USA)",
    group: "D",
    elo: 1810,
    continent: "North America",
    isHost: true,
    players: [
      { id: "pulisic", name: "克里斯蒂安·普利希奇 (Christian Pulisic)", stars: 4, pos: "FW", status: "fit" },
      { id: "mckennie", name: "温斯顿·麦肯尼 (Weston McKennie)", stars: 3, pos: "MF", status: "fit" },
      { id: "robinson", name: "安东尼·罗宾逊 (Antonee Robinson)", stars: 3, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "paraguay",
    name: "巴拉圭 (Paraguay)",
    group: "D",
    elo: 1720,
    continent: "South America",
    isHost: false,
    players: [
      { id: "almiron", name: "米格尔·阿尔米隆 (Miguel Almirón)", stars: 3, pos: "MF", status: "fit" },
      { id: "enciso", name: "胡里奥·恩西索 (Julio Enciso)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "australia",
    name: "澳大利亚 (Australia)",
    group: "D",
    elo: 1700,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "souttar", name: "哈里·苏塔尔 (Harry Souttar)", stars: 2, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "turkey",
    name: "土耳其 (Turkey)",
    group: "D",
    elo: 1790,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "guler", name: "阿尔达·居莱尔 (Arda Güler)", stars: 4, pos: "MF", status: "fit" },
      { id: "calhanoglu", name: "哈坎·恰尔汗奥卢 (Hakan Çalhanoğlu)", stars: 4, pos: "MF", status: "fit" }
    ]
  },

  // Group E
  {
    id: "germany",
    name: "德国 (Germany)",
    group: "E",
    elo: 2020,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "wirtz", name: "弗洛里安·维尔茨 (Florian Wirtz)", stars: 5, pos: "MF", status: "fit" },
      { id: "musiala", name: "贾马尔·穆西亚拉 (Jamal Musiala)", stars: 5, pos: "MF", status: "fit" },
      { id: "rudiger", name: "安东尼奥·吕迪格 (Antonio Rüdiger)", stars: 4, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "curacao",
    name: "库拉索 (Curaçao)",
    group: "E",
    elo: 1540,
    continent: "North America",
    isHost: false,
    players: [
      { id: "bacuna", name: "尤尼尼奥·巴库纳 (Juninho Bacuna)", stars: 2, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "ivory_coast",
    name: "科特迪瓦 (Ivory Coast)",
    group: "E",
    elo: 1780,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "adingra", name: "西蒙·阿丁格拉 (Simon Adingra)", stars: 3, pos: "FW", status: "fit" },
      { id: "kessie", name: "弗兰克·凯西 (Franck Kessié)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "ecuador",
    name: "厄瓜多尔 (Ecuador)",
    group: "E",
    elo: 1890,
    continent: "South America",
    isHost: false,
    players: [
      { id: "caicedo", name: "莫伊塞斯·凯塞多 (Moisés Caicedo)", stars: 4, pos: "MF", status: "fit" },
      { id: "hincapie", name: "皮耶罗·因卡皮耶 (Piero Hincapié)", stars: 3, pos: "DF", status: "fit" }
    ]
  },

  // Group F
  {
    id: "netherlands",
    name: "荷兰 (Netherlands)",
    group: "F",
    elo: 1990,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "vandijk", name: "维吉尔·范戴克 (Virgil van Dijk)", stars: 4, pos: "DF", status: "fit" },
      { id: "simons", name: "哈维·西蒙斯 (Xavi Simons)", stars: 4, pos: "MF", status: "fit" },
      { id: "gakpo", name: "科迪·加克波 (Cody Gakpo)", stars: 4, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "japan",
    name: "日本 (Japan)",
    group: "F",
    elo: 1870,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "mitoma", name: "三笘薫 (Kaoru Mitoma)", stars: 4, pos: "FW", status: "fit" },
      { id: "endo", name: "远藤航 (Wataru Endo)", stars: 3, pos: "MF", status: "fit" },
      { id: "kubo", name: "久保建英 (Takefusa Kubo)", stars: 4, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "sweden",
    name: "瑞典 (Sweden)",
    group: "F",
    elo: 1810,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "gyokeres", name: "维克托·约克雷斯 (Viktor Gyökeres)", stars: 5, pos: "FW", status: "fit" },
      { id: "isak", name: "亚历山大·伊萨克 (Alexander Isak)", stars: 4, pos: "FW", status: "fit" },
      { id: "kulusevski", name: "德扬·库卢塞夫斯基 (Dejan Kulusevski)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "tunisia",
    name: "突尼斯 (Tunisia)",
    group: "F",
    elo: 1660,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "laidouni", name: "艾萨·莱杜尼 (Aïssa Laïdouni)", stars: 2, pos: "MF", status: "fit" }
    ]
  },

  // Group G
  {
    id: "belgium",
    name: "比利时 (Belgium)",
    group: "G",
    elo: 1970,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "debruyne", name: "凯文·德布劳内 (Kevin De Bruyne)", stars: 5, pos: "MF", status: "fit" },
      { id: "doku", name: "杰里米·多库 (Jérémy Doku)", stars: 4, pos: "FW", status: "fit" },
      { id: "lukaku", name: "罗梅卢·卢卡库 (Romelu Lukaku)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "egypt",
    name: "埃及 (Egypt)",
    group: "G",
    elo: 1740,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "salah", name: "穆罕默德·萨拉赫 (Mohamed Salah)", stars: 5, pos: "FW", status: "fit" },
      { id: "marmoush", name: "奥马尔·马尔穆什 (Omar Marmoush)", stars: 4, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "iran",
    name: "伊朗 (Iran)",
    group: "G",
    elo: 1800,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "taremi", name: "迈赫迪·塔雷米 (Mehdi Taremi)", stars: 4, pos: "FW", status: "fit" },
      { id: "azmoun", name: "萨达尔·阿兹蒙 (Sardar Azmoun)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "new_zealand",
    name: "新西兰 (New Zealand)",
    group: "G",
    elo: 1550,
    continent: "Oceania",
    isHost: false,
    players: [
      { id: "wood", name: "克里斯·伍德 (Chris Wood)", stars: 3, pos: "FW", status: "fit" }
    ]
  },

  // Group H
  {
    id: "spain",
    name: "西班牙 (Spain)",
    group: "H",
    elo: 2130,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "rodri", name: "罗德里 (Rodri)", stars: 5, pos: "MF", status: "fit" },
      { id: "yamal", name: "拉明·亚马尔 (Lamine Yamal)", stars: 5, pos: "FW", status: "fit" },
      { id: "williams", name: "尼科·威廉姆斯 (Nico Williams)", stars: 4, pos: "FW", status: "fit" },
      { id: "pedri", name: "佩德里 (Pedri)", stars: 4, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "cape_verde",
    name: "佛得角 (Cape Verde)",
    group: "H",
    elo: 1680,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "mendes", name: "莱恩·门德斯 (Ryan Mendes)", stars: 2, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "saudi_arabia",
    name: "沙特阿拉伯 (Saudi Arabia)",
    group: "H",
    elo: 1620,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "aldawsari", name: "萨利姆·多萨里 (Salem Al-Dawsari)", stars: 2, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "uruguay",
    name: "乌拉圭 (Uruguay)",
    group: "H",
    elo: 1980,
    continent: "South America",
    isHost: false,
    players: [
      { id: "valverde", name: "费德里科·巴尔韦德 (Federico Valverde)", stars: 5, pos: "MF", status: "fit" },
      { id: "nunez", name: "达尔文·努涅斯 (Darwin Núñez)", stars: 4, pos: "FW", status: "fit" },
      { id: "araujo", name: "罗纳德·阿劳霍 (Ronald Araújo)", stars: 4, pos: "DF", status: "fit" }
    ]
  },

  // Group I
  {
    id: "france",
    name: "法国 (France)",
    group: "I",
    elo: 2110,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "mbappe", name: "基利安·姆巴佩 (Kylian Mbappé)", stars: 5, pos: "FW", status: "fit" },
      { id: "griezmann", name: "安东尼·格里兹曼 (Antoine Griezmann)", stars: 4, pos: "FW", status: "fit" },
      { id: "saliba", name: "威廉·萨利巴 (William Saliba)", stars: 5, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "senegal",
    name: "塞内加尔 (Senegal)",
    group: "I",
    elo: 1770,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "jackson", name: "尼古拉斯·杰克逊 (Nicolas Jackson)", stars: 4, pos: "FW", status: "fit" },
      { id: "mane", name: "萨迪奥·马内 (Sadio Mané)", stars: 3, pos: "FW", status: "fit" },
      { id: "koulibaly", name: "卡利杜·库利巴利 (Kalidou Koulibaly)", stars: 3, pos: "DF", status: "fit" }
    ]
  },
  {
    id: "iraq",
    name: "伊拉克 (Iraq)",
    group: "I",
    elo: 1610,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "hussein", name: "艾曼·胡申 (Aymen Hussein)", stars: 2, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "norway",
    name: "挪威 (Norway)",
    group: "I",
    elo: 1830,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "haaland", name: "埃林·哈兰德 (Erling Haaland)", stars: 5, pos: "FW", status: "fit" },
      { id: "odegaard", name: "马丁·厄德高 (Martin Ødegaard)", stars: 5, pos: "MF", status: "fit" },
      { id: "nusa", name: "安东尼奥·努萨 (Antonio Nusa)", stars: 3, pos: "FW", status: "fit" }
    ]
  },

  // Group J
  {
    id: "argentina",
    name: "阿根廷 (Argentina)",
    group: "J",
    elo: 2150,
    continent: "South America",
    isHost: false,
    players: [
      { id: "messi", name: "利昂内尔·梅西 (Lionel Messi)", stars: 5, pos: "FW", status: "fit" },
      { id: "martinez_e", name: "埃米利亚诺·马丁内斯 (Emiliano Martínez)", stars: 4, pos: "GK", status: "fit" },
      { id: "macallister", name: "亚历克西斯·麦卡利斯特 (Alexis Mac Allister)", stars: 4, pos: "MF", status: "fit" },
      { id: "martinez_l", name: "劳塔罗·马丁内斯 (Lautaro Martínez)", stars: 4, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "algeria",
    name: "阿尔及利亚 (Algeria)",
    group: "J",
    elo: 1710,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "mahrez", name: "里亚德·马赫雷斯 (Riyad Mahrez)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "austria",
    name: "奥地利 (Austria)",
    group: "J",
    elo: 1850,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "alaba", name: "大卫·阿拉巴 (David Alaba)", stars: 4, pos: "DF", status: "fit" },
      { id: "sabitzer", name: "马塞尔·萨比策 (Marcel Sabitzer)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "jordan",
    name: "约旦 (Jordan)",
    group: "J",
    elo: 1600,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "tamari", name: "穆萨·塔马里 (Mousa Al-Tamari)", stars: 3, pos: "FW", status: "fit" }
    ]
  },

  // Group K
  {
    id: "portugal",
    name: "葡萄牙 (Portugal)",
    group: "K",
    elo: 2040,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "ronaldo", name: "克里斯蒂亚诺·罗纳尔多 (Cristiano Ronaldo)", stars: 4, pos: "FW", status: "fit" },
      { id: "fernandes", name: "布鲁诺·费尔南德斯 (Bruno Fernandes)", stars: 5, pos: "MF", status: "fit" },
      { id: "dias", name: "鲁本·迪亚斯 (Rúben Dias)", stars: 5, pos: "DF", status: "fit" },
      { id: "leao", name: "拉斐尔·莱奥 (Rafael Leão)", stars: 4, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "dr_congo",
    name: "民主刚果 (DR Congo)",
    group: "K",
    elo: 1670,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "mbemba", name: "钱塞尔·姆本巴 (Chancel Mbemba)", stars: 3, pos: "DF", status: "fit" },
      { id: "wissa", name: "尤安·维萨 (Yoane Wissa)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "uzbekistan",
    name: "乌兹别克斯坦 (Uzbekistan)",
    group: "K",
    elo: 1640,
    continent: "Asia",
    isHost: false,
    players: [
      { id: "shomurodov", name: "埃尔多尔·肖穆罗多夫 (Eldor Shomurodov)", stars: 2, pos: "FW", status: "fit" },
      { id: "fayzullaev", name: "阿博斯别克·法伊祖拉耶夫 (Abbosbek Fayzullaev)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "colombia",
    name: "哥伦比亚 (Colombia)",
    group: "K",
    elo: 1960,
    continent: "South America",
    isHost: false,
    players: [
      { id: "diaz", name: "路易斯·迪亚斯 (Luis Díaz)", stars: 4, pos: "FW", status: "fit" },
      { id: "rodriguez", name: "哈梅斯·罗德里格斯 (James Rodríguez)", stars: 3, pos: "MF", status: "fit" }
    ]
  },

  // Group L
  {
    id: "england",
    name: "英格兰 (England)",
    group: "L",
    elo: 2090,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "kane", name: "哈里·凯恩 (Harry Kane)", stars: 5, pos: "FW", status: "fit" },
      { id: "bellingham", name: "朱德·贝林厄姆 (Jude Bellingham)", stars: 5, pos: "MF", status: "fit" },
      { id: "saka", name: "布卡约·萨卡 (Bukayo Saka)", stars: 4, pos: "FW", status: "fit" },
      { id: "rice", name: "德克兰·赖斯 (Declan Rice)", stars: 4, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "croatia",
    name: "克罗地亚 (Croatia)",
    group: "L",
    elo: 1910,
    continent: "Europe",
    isHost: false,
    players: [
      { id: "modric", name: "卢卡·莫德里奇 (Luka Modrić)", stars: 4, pos: "MF", status: "fit" },
      { id: "gvardiol", name: "约什科·格瓦迪奥尔 (Joško Gvardiol)", stars: 5, pos: "DF", status: "fit" },
      { id: "kovacic", name: "马特奥·科瓦契奇 (Mateo Kovačić)", stars: 3, pos: "MF", status: "fit" }
    ]
  },
  {
    id: "ghana",
    name: "加纳 (Ghana)",
    group: "L",
    elo: 1680,
    continent: "Africa",
    isHost: false,
    players: [
      { id: "kudus", name: "穆罕默德·库杜斯 (Mohammed Kudus)", stars: 4, pos: "MF", status: "fit" },
      { id: "williams_i", name: "伊尼亚基·威廉姆斯 (Inaki Williams)", stars: 3, pos: "FW", status: "fit" }
    ]
  },
  {
    id: "panama",
    name: "巴拿马 (Panama)",
    group: "L",
    elo: 1670,
    continent: "North America",
    isHost: false,
    players: [
      { id: "carrilla", name: "阿达尔贝托·卡拉斯基利亚 (Adalberto Carrasquilla)", stars: 2, pos: "MF", status: "fit" }
    ]
  }
];

// Group mapping helper
const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Export or attach to window
if (typeof window !== "undefined") {
  window.TEAMS_DATA = TEAMS_DATA;
  window.GROUPS = GROUPS;
}
