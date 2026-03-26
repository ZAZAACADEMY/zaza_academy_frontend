const BASE_URL = "https://api.zaza-academy.com";
const LOGIN_URL = `${BASE_URL}/api/v1/auth/login/`;
const PLANS_URL = `${BASE_URL}/api/plans/`;

const credentials = {
  email: "cabrelniamekon@gmail.com",
  password: "Mypass@123"
};

const plans = [
  {
    name: "STANDARD",
    price_one_month: "70.00",
    price_three_months: "199.00",
    description: "Accès complet pour 1 enfant. Idéal pour débuter l'éducation financière.",
    status: 1
  },
  {
    name: "PREMIUM",
    price_one_month: "90.00",
    price_three_months: "249.00",
    description: "Accès complet pour jusqu'à 3 enfants. Le choix préféré des familles.",
    status: 1
  },
  {
    name: "FAMILLE",
    price_one_month: "180.00",
    price_three_months: "499.00",
    description: "Accès illimité pour jusqu'à 5 enfants. Pour les grandes familles ambitieuses.",
    status: 1
  }
];

async function seed() {
  console.log("Tentative de connexion à", LOGIN_URL);
  try {
    const loginRes = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (!loginRes.ok) {
      const error = await loginRes.text();
      console.error("Erreur de connexion:", error);
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.access;
    
    if (!token) {
      console.error("Token non reçu. Réponse:", loginData);
      return;
    }

    console.log("Connexion réussie ! Token (début):", token.substring(0, 20) + "...");

    for (const plan of plans) {
      console.log(`Création du plan ${plan.name} à ${PLANS_URL}...`);
      const planRes = await fetch(PLANS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(plan)
      });

      const responseText = await planRes.text();
      if (planRes.ok) {
        console.log(`✅ Plan ${plan.name} créé avec succès.`);
      } else {
        console.error(`❌ Échec de la création du plan ${plan.name} (${planRes.status}):`, responseText);
      }
    }
  } catch (err) {
    console.error("Erreur inattendue:", err);
  }
}

seed().catch(console.error);
