# Commande `/help`

### Description
La commande `/help` affiche une aide détaillée pour utiliser les différentes commandes du bot Discord. Elle fournit également un lien vers le dépôt GitHub du projet pour plus d'informations ou de contributions.

### Structure

```bash
/help
```

### Fonctionnalité

1. **Affichage d'un embed d'aide** :

  - Lorsqu'un utilisateur exécute la commande `/help`, un message éphémère contenant un embed est envoyé. Cet embed présente une vue d'ensemble des commandes disponibles.

2. **Bouton vers le répon Github** :

  - En plus de l'embed, un bouton nommé "Github" est ajouté. Ce bouton redirige vers le repo Github du projet pour permettre aux utilisateurs de consulter le code source ou contribuer au développment.

3. **Réponse éphémère** :

  - Le message d'aide est envoyé sous forme éphémère, uniquement visible par l'utilisateur qui a envoyé la commande.

### Composants

- `ButtonBuilder` :
  - Un bouton nommé "**Github**" est ajouté au message. Ce bouton utilise le style `ButtonStyle.Link` et pointe vers l'URL du repo Github du bot : `https://github.com/discord-bot-points/Points-Discord`.

- `ActionRowBuilder` :
  - Le bouton est encapsulé dans une `ActionRowBuilder` pour être inclus dans le message de réponse.

### Gestion des réponses

La commande utilise la méthode `interaction.reply` pour envoyer une réponse contenant :

- **L'embed d'aide** (informations sur le bot et les commandes disponibles).
- **Le bouton Github** permettant d'accéder au repo du projet.
- **Réponse éphémère** : La réponse est visible uniquement par l'utilisateur qui a exécuté la commande.

### Exemple d'utilisation

```bash
/help
```

- Lorsque cette commande est utilisée, l'utilisateur reçoit un message éphémère avec un aperçu des commandes disponibles et un bouton pour consulter le repo Github.
