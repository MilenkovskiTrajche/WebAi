import type { Localized } from "../features/menu/types";
// Translation drafts: owner/native-speaker review remains on the content checklist.
export const additionalNames: Record<
  string,
  Pick<Localized, "el" | "sr" | "sq">
> = {
  "village-breakfast": {
    el: "Χωριάτικο πρωινό",
    sr: "Сеоски доручак",
    sq: "Mëngjes fshati",
  },
  omelette: {
    el: "Ομελέτα με λαχανικά",
    sr: "Омлет са поврћем",
    sq: "Omëletë me perime",
  },
  "french-toast": {
    el: "Αυγόφετες",
    sr: "Прженице",
    sq: "Bukë e skuqur me vezë",
  },
  ajvar: {
    el: "Ψωμί και άιβαρ",
    sr: "Хлеб и ајвар",
    sq: "Bukë dhe ajvar",
  },
  shopska: {
    el: "Σαλάτα σόπσκα",
    sr: "Шопска салата",
    sq: "Sallatë shopska",
  },
  "roasted-peppers": {
    el: "Ψητές πιπεριές",
    sr: "Печене паприке",
    sq: "Speca të pjekur",
  },
  "seasonal-salad": {
    el: "Πράσινη σαλάτα εποχής",
    sr: "Сезонска зелена салата",
    sq: "Sallatë jeshile e stinës",
  },
  tavche: {
    el: "Τάβτσε γκράβτσε — φασόλια στον φούρνο",
    sr: "Тавче гравче",
    sq: "Tavçe gravçe — fasule në tavë",
  },
  chicken: {
    el: "Κοτόπουλο στη σχάρα",
    sr: "Пилетина са роштиља",
    sq: "Pulë në zgarë",
  },
  trout: {
    el: "Πέστροφα στη σχάρα",
    sr: "Пастрмка на жару",
    sq: "Troftë në zgarë",
  },
  "vegetable-platter": {
    el: "Πιατέλα λαχανικών",
    sr: "Тањир поврћа",
    sq: "Pjatë me perime",
  },
  pasta: {
    el: "Ζυμαρικά με ντομάτα και βασιλικό",
    sr: "Тестенина са парадајзом и босиљком",
    sq: "Makarona me domate dhe borzilok",
  },
  baklava: {
    el: "Μπακλαβάς με καρύδια",
    sr: "Баклава са орасима",
    sq: "Bakllava me arra",
  },
  pancakes: {
    el: "Κρέπες με σοκολάτα",
    sr: "Палачинке са чоколадом",
    sq: "Palaçinka me çokollatë",
  },
  espresso: {
    el: "Εσπρέσο",
    sr: "Еспресо",
    sq: "Espreso",
  },
  tea: {
    el: "Τσάι του βουνού",
    sr: "Планински чај",
    sq: "Çaj mali",
  },
  lemonade: {
    el: "Φρέσκια λεμονάδα",
    sr: "Свежа лимунада",
    sq: "Limonadë e freskët",
  },
  wine: {
    el: "Ποτήρι κόκκινο κρασί",
    sr: "Чаша црвеног вина",
    sq: "Gotë verë e kuqe",
  },
};

// Ingredient translations are independent of names; preserve the existing recipe details.
export const additionalIngredients: Record<
  string,
  Record<"el" | "sr" | "sq", string>
> = {
  "village-breakfast": {
    el: "Αυγά, λευκό τυρί, ντομάτα, ελιές και ζεστό ψωμί.",
    sr: "Јаја, бели сир, парадајз, маслине и топао хлеб.",
    sq: "Vezë, djathë i bardhë, domate, ullinj dhe bukë e ngrohtë.",
  },
  omelette: {
    el: "Τρία αυγά με λαχανικά εποχής και λευκό τυρί.",
    sr: "Три јајета са сезонским поврћем и белим сиром.",
    sq: "Tri vezë me perime të stinës dhe djathë të bardhë.",
  },
  "french-toast": {
    el: "Ψωμί βουτηγμένο σε αυγό, λευκό τυρί και ξινή κρέμα.",
    sr: "Хлеб са јајима, бели сир и павлака.",
    sq: "Bukë e lyer me vezë, djathë i bardhë dhe ajkë e thartë.",
  },
  ajvar: {
    el: "Άλειμμα ψητής πιπεριάς, ζεστό ψωμί και ελιές.",
    sr: "Намаз од печених паприка, топао хлеб и маслине.",
    sq: "Krem specash të pjekur, bukë e ngrohtë dhe ullinj.",
  },
  shopska: {
    el: "Ντομάτα, αγγούρι, πράσινη πιπεριά, κρεμμύδι και τριμμένο λευκό τυρί.",
    sr: "Парадајз, краставац, зелена паприка, лук и рендани бели сир.",
    sq: "Domate, kastravec, spec i gjelbër, qepë dhe djathë i bardhë i grirë.",
  },
  "roasted-peppers": {
    el: "Ψητές πιπεριές με σκόρδο, μαϊντανό και ελαιόλαδο.",
    sr: "Печене паприке са белим луком, першуном и маслиновим уљем.",
    sq: "Speca të pjekur me hudhër, majdanoz dhe vaj ulliri.",
  },
  "seasonal-salad": {
    el: "Φρέσκα πράσινα φύλλα, αγγούρι, ραπανάκι και ντρέσινγκ λεμονιού.",
    sr: "Свежи зелени листови, краставац, ротквица и прелив од лимуна.",
    sq: "Gjethe të freskëta jeshile, kastravec, rrepkë dhe salcë limoni.",
  },
  tavche: {
    el: "Φασόλια στον φούρνο με κρεμμύδι, γλυκιά πάπρικα και αποξηραμένη πιπεριά.",
    sr: "Печени пасуљ са луком, слатком млевеном паприком и сувом паприком.",
    sq: "Fasule të pjekura me qepë, spec të kuq të bluar dhe spec të tharë.",
  },
  chicken: {
    el: "Φιλέτο κοτόπουλου, ψητές πατάτες και λαχανικά εποχής.",
    sr: "Пилећи филе, печени кромпир и сезонско поврће.",
    sq: "Fileto pule, patate të pjekura dhe perime të stinës.",
  },
  trout: {
    el: "Ολόκληρη πέστροφα με λεμόνι, μαϊντανό και πατάτες.",
    sr: "Цела пастрмка са лимуном, першуном и кромпиром.",
    sq: "Troftë e plotë me limon, majdanoz dhe patate.",
  },
  "vegetable-platter": {
    el: "Κολοκύθι, μελιτζάνα και πιπεριές στη σχάρα με ρύζι με μανιτάρια.",
    sr: "Тиквице, плави патлиџан и паприке са роштиља са пиринчем са печуркама.",
    sq: "Kungulleshka, patëllxhan dhe speca në zgarë me oriz me kërpudha.",
  },
  pasta: {
    el: "Ζυμαρικά σε σάλτσα ντομάτας με φρέσκο βασιλικό και σκληρό τυρί.",
    sr: "Тестенина у сосу од парадајза са свежим босиљком и тврдим сиром.",
    sq: "Makarona në salcë domatesh me borzilok të freskët dhe djathë të fortë.",
  },
  baklava: {
    el: "Λεπτά φύλλα ζύμης, καρύδια και σιρόπι λεμονιού.",
    sr: "Танке коре, ораси и шербет са лимуном.",
    sq: "Petë të holla, arra dhe sherbet me limon.",
  },
  pancakes: {
    el: "Ζεστές κρέπες με σοκολάτα και τριμμένα φουντούκια.",
    sr: "Топле палачинке са чоколадом и дробљеним лешницима.",
    sq: "Palaçinka të ngrohta me çokollatë dhe lajthi të thërrmuara.",
  },
  espresso: {
    el: "Ένας μικρός, αρωματικός καφές.",
    sr: "Кратка, ароматична кафа.",
    sq: "Kafe e shkurtër dhe aromatike.",
  },
  tea: {
    el: "Αφέψημα βοτάνων, σερβιρισμένο με λεμόνι.",
    sr: "Биљни чај, послужен са лимуном.",
    sq: "Çaj bimor, i shërbyer me limon.",
  },
  lemonade: {
    el: "Φρέσκος χυμός λεμονιού και μη ανθρακούχο νερό.",
    sr: "Свеж сок од лимуна и негазирана вода.",
    sq: "Lëng i freskët limoni dhe ujë pa gaz.",
  },
  wine: {
    el: "Ρωτήστε το προσωπικό μας για τις διαθέσιμες επιλογές.",
    sr: "Питајте особље о доступном избору.",
    sq: "Pyesni stafin për përzgjedhjen në dispozicion.",
  },
};
