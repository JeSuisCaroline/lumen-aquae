import {Step} from '../shared/models/game-step.model';

export const SCENARIO: Step[] = [
  {
    id: "s1",
    title: "Place de l'Hôtel de Ville",
    description: "Le soleil tape sur les pavés d'Aix. Vous êtes devant l'horloge. Un marchand vous observe étrangement.",
    choices: [
      { id: "s1c1", text: "Lui parler du Secret", nextStepId: "s2" },
      { id: "s1c2", text: "Ignorer et aller vers la fontaine", nextStepId: "s3", gainGold: 5 }
    ]
  },
  {
    id: "s2",
    title: "La Rencontre",
    description: "Le marchand fronce les sourcils. 'Vous n'êtes pas d'ici... prouvez-le !'",
    choices: [
      { id: "s2c1", text: "Recommencer l'aventure", nextStepId: "s1" }
    ]
  },
  {
    id: "s3",
    title: "La Fontaine Moussue",
    description: "L'eau fraîche coule. Vous avez trouvé 5 Florins par terre ! Mais un garde approche.",
    choices: [
      { id: "s3c1", text: "Se cacher", nextStepId: "s1" },
      { id: "s3c1", text: "S'enfuir vers les Cardeurs", nextStepId: "s1" }
    ]
  }
];
