# README - Bot Discord Points pour The Hacking Project

## 📚 Présentation du Projet

Bienvenue dans le projet **Bot Discord Points** pour *The Hacking Project*. Ce bot permet de distribuer des points THP en récompense de l'implication des membres.

## 🚀 Technologies Utilisées

Voici un aperçu des principales technologies utilisées :

- **Backend** :
  - Node.js
  - Typescript

- **Base de Données** :
  - Utilisation de l'ORM [Prisma](https://www.prisma.io/docs)

- **Gestion de Version** :
  - Git & GitHub - pour le contrôle de version et la collaboration

## ⚙️ Commandes d'Installation et de Lancement

Suivez ces étapes pour faire fonctionner le projet sur votre machine locale :

### Prérequis
Assurez-vous d'avoir les éléments suivants installés :
- [**Node.js** ](https://nodejs.org/en)
- **npm** ou **pnpm** comme gestionnaire de paquets js
- [Git](https://git-scm.com/)
- Un éditeur de code comme [VS Code](https://code.visualstudio.com/)

### Installation

1. **Cloner le repository** :
- **SSH** :
   ```bash
   git clone git@github.com:discord-bot-points/Points-Discord.git
   ```
- **HTTPS** :
   ```bash
   git clone https://github.com/discord-bot-points/Points-Discord.git
   ```

2. **Initialisation** :
   ```bash
   cd Points-Discord
   ```
    ```bash
    npm i
    ```
    **ou**
    ```bash
    pnpm i
    ```
    
3. **Lancement du serveur** :
    ```bash
    npm run dev
    ```
    **ou**
    ```bash
    pnpm run dev
    ```

## Commandes

- **Help**
  
`/help` vous permet d'accèder à la rubrique d'aide.
- **Balance**
  
`/balance` vous permet d'afficher votre solde de points THP.

`/balance user` vous permet d'afficher le solde de points d'un autre membre.
- **Send**
  
`/send` vous permet d'envoyer des points à un membre :
  - User : champ obligatoire
  - Points : champ obligatoire
  - Domain : champ obligatoire
  - Description : champ facultatif
  - Link : champ facultatif

## Contributeurs :
Merci à tous ceux qui ont contribué à ce projet !
- [@Alexia Scherer](https://github.com/evarellapucky)
- [@Yann Rezigui](https://github.com/YannRZG)
- [@Raphaël Marcarini](https://github.com/Marcaraph)
- [@Jeremie Olivier](https://github.com/jeremie-olivier)
