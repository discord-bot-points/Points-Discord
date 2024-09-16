# Documentation : Commande `/balance` du bot Discord

## Table des matières
1. Aperçu général
2. Prérequis
3. Fonctionnement de la commande
4. Utilisation de Prisma
5. Création et envoi d'un Embed
6. Gestion des erreurs

## 1. Aperçu général

Cette commande permet à un utilisateur de consulter la balance de points d'un utilisateur Discord. Si aucun utilisateur n'est spécifié, la commande retourne la balance de l'utilisateur qui a exécuté la commande. Le bot utilise [Prisma](https://www.prisma.io/) pour interagir avec une base de données, et la méthode `SlashCommandBuilder` de Discord.js pour définir la commande.

## 2. Prérequis

- **Discord.js v14 ou supérieur** : Cette commande utilise la librairie Discord.js pour interagir avec l'API de Discord. Assurez-vous d'avoir la version compatible.

  ```bash
  npm install discord.js
  ```

- **Prisma** : Prisma est utilisé pour gérer la base de données, dans ce cas précis pour stocker et récupérer les informations des utilisateurs.

    ```bash
    npm install @prisma/client
    ```

## 3. Fonctionnement de la commande
**Commande**
    ```javascript
        export const data = new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Affiche ta balance de points")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("Voir les points de cet utilisateur")
            .setRequired(false)
        );
    ```

La commande /balance permet d'afficher la balance de points.
L'option user est facultative. Si elle n'est pas spécifiée, la balance de l'utilisateur qui a lancé la commande sera affichée.
Exécution de la commande
typescript
Copier le code
export async function execute(interaction: CommandInteraction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const discordUsername = targetUser.username.toLowerCase();
L'utilisateur spécifié dans l'option user est récupéré. Si aucun utilisateur n'est spécifié, c'est l'utilisateur exécutant la commande qui est utilisé.
Le nom d'utilisateur est transformé en minuscule pour standardiser les requêtes à la base de données.
4. Utilisation de Prisma
Requête pour trouver l'utilisateur
typescript
Copier le code
let user = await prisma.user.findUnique({
  where: { discordUsername: discordUsername }
});
findUnique recherche un utilisateur dans la base de données à partir du nom d'utilisateur Discord. Si l'utilisateur n'est pas trouvé, la commande créera une nouvelle entrée.
Création d'un nouvel utilisateur
typescript
Copier le code
if (!user) {
  user = await prisma.user.create({
    data: {
      discordUsername: discordUsername,
      balance: 0,
      pointsSent: 0,
      pointsReceived: 0,
    },
  });
}
Si l'utilisateur n'existe pas dans la base de données, Prisma en crée un avec une balance par défaut de 0.
5. Création et envoi d'un Embed
Embed personnalisé
typescript
Copier le code
const balanceEmbed = new EmbedBuilder()
  .setColor(4772300)
  .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
  .addFields(
    { name: '\u2009', value: '\u2009' },
    { name: `Balance de ${targetUser.globalName}`, value: `La balance actuelle de <@${targetUser.id}> est de ${user.balance} points` },
    { name: '\u2009', value: '\u2009' }
  )
  .setTimestamp();
Un Embed est utilisé pour afficher la balance de manière esthétique. Le nom d'utilisateur et l'ID Discord sont insérés dynamiquement pour personnaliser l'affichage.
La couleur de l'embed est définie à 4772300 et l'auteur de l'embed est configuré avec un logo et un lien.
Réponse de l'interaction
typescript
Copier le code
await interaction.reply({
  embeds: [balanceEmbed],
  ephemeral: true,
});
La réponse est envoyée sous forme d'embed et est définie comme ephemeral, ce qui signifie qu'elle ne sera visible que par l'utilisateur ayant exécuté la commande.
6. Gestion des erreurs
typescript
Copier le code
catch (error) {
  console.error('Erreur lors de la récupération de la balance', error);
  await interaction.reply({
    content: "Une erreur s'est produite lors de la récupération de votre balance",
    ephemeral: true,
  });
}
En cas d'erreur lors de la récupération des données utilisateur ou de la création d'un nouvel utilisateur, une erreur est loguée et une réponse ephemeral est envoyée à l'utilisateur pour l'informer que quelque chose s'est mal passé.
Exemple d'utilisation
Un utilisateur peut taper /balance pour voir sa propre balance.
Un utilisateur peut aussi taper /balance user:@nomdutilisateur pour voir la balance d'un autre utilisateur Discord.