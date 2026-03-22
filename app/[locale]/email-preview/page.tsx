"use client";
import { useState } from "react";

const templates = [
  {
    id: "email-verification",
    file: "/email-templates/email-verification.html",
    title: "Vérification de l'email",
    emoji: "✉️",
    description:
      "Envoyé lors de la création du compte pour confirmer l'adresse email.",
    color: "from-[#311F54] to-[#7F26D9]",
    tag: "Compte",
    tagColor: "bg-[#EFEEFF] text-[#7F26D9]",
    variables: [
      "{{ params.FIRSTNAME }} — Prénom du parent",
      "{{ params.VERIFICATION_URL }} — Lien de vérification",
    ],
  },
  {
    id: "welcome",
    file: "/email-templates/welcome.html",
    title: "Bienvenue sur la plateforme",
    emoji: "🎉",
    description:
      "Envoyé après la vérification de l'email pour souhaiter la bienvenue.",
    color: "from-[#7F26D9] to-[#C23CDD] via-[#7F26D9]",
    tag: "Compte",
    tagColor: "bg-[#EFEEFF] text-[#7F26D9]",
    variables: [
      "{{ params.FIRSTNAME }} — Prénom du parent",
      "{{ params.DASHBOARD_URL }} — Lien vers le dashboard",
    ],
  },
  {
    id: "live-created",
    file: "/email-templates/live-created.html",
    title: "Live programmé",
    emoji: "📅",
    description:
      "Envoyé aux parents quand un live est créé et concerne leur enfant.",
    color: "from-[#311F54] to-[#7F26D9]",
    tag: "Live",
    tagColor: "bg-purple-100 text-purple-700",
    variables: [
      "{{ params.PARENT_NAME }} — Nom du parent",
      "{{ params.CHILD_USERNAME }} — Pseudo de l'enfant",
      "{{ params.LIVE_TITLE }} — Titre du live",
      "{{ params.LIVE_DATE }} — Date du live",
      "{{ params.LIVE_TIME }} — Heure du live",
      "{{ params.AGE_GROUP }} — Tranche d'âge",
      "{{ params.LIVE_URL }} — Lien vers le live",
    ],
  },
  {
    id: "live-reminder-1h",
    file: "/email-templates/live-reminder-1h.html",
    title: "Rappel 1h avant le live",
    emoji: "⏰",
    description:
      "Envoyé aux parents 1 heure avant le début de la session live.",
    color: "from-[#C23CDD] to-[#DC2663]",
    tag: "Live",
    tagColor: "bg-pink-100 text-pink-700",
    variables: [
      "{{ params.PARENT_NAME }} — Nom du parent",
      "{{ params.CHILD_USERNAME }} — Pseudo de l'enfant",
      "{{ params.LIVE_TITLE }} — Titre du live",
      "{{ params.LIVE_TIME }} — Heure du live",
      "{{ params.LIVE_URL }} — Lien vers le live",
    ],
  },
  {
    id: "live-now",
    file: "/email-templates/live-now.html",
    title: "Le live commence maintenant",
    emoji: "🔴",
    description: "Envoyé aux parents au moment précis où le live démarre.",
    color: "from-[#DC2663] to-[#F46AA3]",
    tag: "Live",
    tagColor: "bg-red-100 text-red-700",
    variables: [
      "{{ params.PARENT_NAME }} — Nom du parent",
      "{{ params.CHILD_USERNAME }} — Pseudo de l'enfant",
      "{{ params.LIVE_TITLE }} — Titre du live",
      "{{ params.LIVE_URL }} — Lien pour rejoindre",
    ],
  },
  {
    id: "new-video",
    file: "/email-templates/new-video.html",
    title: "Nouvelle vidéo disponible",
    emoji: "🎥",
    description:
      "Envoyé quand une nouvelle vidéo éducative est ajoutée à la plateforme.",
    color: "from-[#311F54] to-[#7F26D9]",
    tag: "Contenu",
    tagColor: "bg-indigo-100 text-indigo-700",
    variables: [
      "{{ params.PARENT_NAME }} — Nom du parent",
      "{{ params.VIDEO_TITLE }} — Titre de la vidéo",
      "{{ params.VIDEO_DESCRIPTION }} — Description",
      "{{ params.VIDEO_THUMBNAIL_URL }} — Miniature",
      "{{ params.AGE_GROUP }} — Tranche d'âge",
      "{{ params.VIDEO_URL }} — Lien vers la vidéo",
      "{{ params.UNSUBSCRIBE_URL }} — Lien désabonnement",
    ],
  },
  {
    id: "password-reset",
    file: "/email-templates/password-reset.html",
    title: "Code de vérification (mot de passe)",
    emoji: "🔐",
    description:
      "Envoyé quand un utilisateur demande à réinitialiser son mot de passe.",
    color: "from-[#311F54] to-[#7F26D9]",
    tag: "Sécurité",
    tagColor: "bg-yellow-100 text-yellow-700",
    variables: [
      "{{ params.FIRSTNAME }} — Prénom",
      "{{ params.RESET_CODE }} — Code OTP (ex: 482917)",
      "{{ params.EXPIRY_MINUTES }} — Durée de validité (ex: 15)",
      "{{ params.CODE_LENGTH }} — Longueur du code (ex: 6)",
    ],
  },
];

export default function EmailPreviewPage() {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [activeVars, setActiveVars] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F0EDFA] via-[#FDFCF8] to-[#F0EDFA]">
      {/* Header */}
      <div className="bg-linear-to-r from-[#311F54] to-[#7F26D9] shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <span className="text-white font-black text-2xl tracking-[3px] uppercase">
                ZAZA
              </span>
              <span className="text-white/70 text-xs block tracking-widest uppercase">
                Education
              </span>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">
                Aperçu des templates email
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {templates.length} templates · Plateforme d'envoi :{" "}
                <strong className="text-white">Brevo</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notice banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <span className="text-amber-600 text-lg">⚠️</span>
          <p className="text-amber-800 text-sm">
            <strong>Mode aperçu temporaire.</strong> Les variables Brevo (ex:{" "}
            <code className="bg-amber-100 px-1 rounded text-xs">
              {"{{ params.FIRSTNAME }}"}
            </code>
            ) apparaissent telles quelles — elles seront remplacées par les
            vraies valeurs lors de l'envoi. Pour remettre la landing page :
            remplacer le contenu de{" "}
            <code className="bg-amber-100 px-1 rounded text-xs">
              app/[locale]/page.tsx
            </code>{" "}
            par{" "}
            <code className="bg-amber-100 px-1 rounded text-xs">
              {"<Home />"}
            </code>
            .
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-white/60
                         hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Card header */}
              <div className={`bg-linear-to-br ${tpl.color} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-4xl">{tpl.emoji}</span>
                    <h2 className="font-bold text-lg mt-3 leading-snug">
                      {tpl.title}
                    </h2>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${tpl.tagColor} bg-white/20 text-white border border-white/30`}
                  >
                    {tpl.tag}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Variables toggle */}
                <button
                  onClick={() =>
                    setActiveVars(activeVars === tpl.id ? null : tpl.id)
                  }
                  className="text-left text-xs font-semibold text-[#7F26D9] hover:text-[#311F54]
                             transition-colors flex items-center gap-1"
                >
                  {activeVars === tpl.id ? "▾" : "▸"} Variables Brevo (
                  {tpl.variables.length})
                </button>

                {activeVars === tpl.id && (
                  <div className="bg-[#F0EDFA] rounded-xl p-3 border border-[#e5deff]">
                    <ul className="space-y-1">
                      {tpl.variables.map((v, i) => (
                        <li
                          key={i}
                          className="text-xs text-[#5a4472] font-mono leading-relaxed"
                        >
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  <a
                    href={tpl.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 bg-linear-to-r from-[#7F26D9] to-[#DC2663]
                               text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Ouvrir →
                  </a>
                  <button
                    onClick={() =>
                      setActivePreview(activePreview === tpl.id ? null : tpl.id)
                    }
                    className="flex-1 text-center py-2.5 bg-[#EFEEFF] text-[#7F26D9]
                               text-sm font-semibold rounded-xl hover:bg-[#e0dbff] transition-colors"
                  >
                    {activePreview === tpl.id ? "Fermer" : "Aperçu inline"}
                  </button>
                </div>
              </div>

              {/* Inline iframe preview */}
              {activePreview === tpl.id && (
                <div className="border-t border-gray-100">
                  <iframe
                    src={tpl.file}
                    title={tpl.title}
                    className="w-full border-0"
                    style={{ height: "500px" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-[#e5deff] shadow-sm">
          <h3 className="font-bold text-[#311F54] text-lg mb-4">
            📌 Instructions pour l'équipe backend
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="font-semibold text-[#311F54] mb-2">
                Intégration Brevo
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Créer un template dans Brevo (Email Templates)</li>
                <li>Copier le contenu HTML de chaque fichier</li>
                <li>
                  Les variables{" "}
                  <code className="bg-[#F0EDFA] px-1 rounded text-xs">
                    {"{{ params.XXX }}"}
                  </code>{" "}
                  sont déjà au format Brevo
                </li>
                <li>Mettre l'URL du logo réel à la place du bloc texte ZAZA</li>
                <li>Tester avec l'aperçu Brevo avant d'activer</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold text-[#311F54] mb-2">
                Fichiers disponibles
              </p>
              <ul className="space-y-1">
                {templates.map((t) => (
                  <li key={t.id} className="flex items-center gap-2">
                    <span>{t.emoji}</span>
                    <code className="bg-[#F0EDFA] px-2 py-0.5 rounded text-xs text-[#7F26D9]">
                      public/email-templates/{t.id}.html
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
