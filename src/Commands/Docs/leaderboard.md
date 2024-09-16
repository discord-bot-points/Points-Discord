# Commande `leaderboard`

La commande `leaderboard` affiche les 10 meilleurs contributeurs d'un serveur Discord en fonction de leur solde de points.

***Quelle est la différence avec la commande `leaderboard` ?***

--> `public_leaderboard` est visible pour tout le monde, affiche les avatars mais ne tag personne

--> `leaderboard` est visible que pour celui qui a lancé la commande, n'affiche pas les avatars mais tag les personnes

## Description

Cette commande utilise Prisma pour interagir avec une base de données et récupérer les 10 utilisateurs ayant le solde de points le plus élevé. Les résultats sont affichés dans un embed Discord avec des informations sur chaque utilisateur. En pied de page il y a un bouton pour voir plus de détails sur le web.

## Utilisation

```ts
/leaderboard
```

## Fonctionnalités

- Affiche les 10 meilleurs contributeurs avec leur solde de points.
- Trie les utilisateurs par solde de points décroissant et par nom d'utilisateur Discord en cas d'égalité.
- Affiche un message si aucun utilisateur n'est trouvé dans la base de données.
- Utilise des emojis pour les trois premiers utilisateurs.
- Ajoute un bouton pour voir plus de détails sur le web.

![Exemple d'embed Discord](../../Assets/Images/bot_point_leaderboard.png)

## Exemple de sortie

Un embed Discord avec les informations suivantes :

- **Titre** : `Leaderboard`
- **Description** : `Top 10 contributeurs :`
- **Liste des utilisateurs** avec leur position, mention Discord et solde de points.
- **Bouton** : Lien vers le dashboard web pour plus de détails

## Remarques

- Assurez-vous que la base de données est correctement configurée et que les utilisateurs ont des soldes de points.
- La commande utilise des composants interactifs de Discord.js pour afficher les résultats et le bouton.