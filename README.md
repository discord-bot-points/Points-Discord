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
    *ou*
    ```bash
    pnpm i
    ```
    
3. **Créer le fichier .env** :

    Créer un fichier .env qui reprend les variables du fichier .env.example en remplaçant les exemples par vos propres variables. La seed de base gère la création de 2 utilisateurs et 3 domaines. Si vous souhaitez en créer davantage, il vous suffit de copier les variables existantes dans le env.example et de rajouter les variables créées dans le [config.ts](https://github.com/discord-bot-points/Points-Discord/blob/main/src/config.ts).

4. **Créer les migrations et lancer la seed pour créer votre base de données** :

    ```bash
    npx prisma migrate dev
    ```
    *ou*
    ```bash
    pnpm dlx prisma migrate dev
    ```

    **et ensuite**

    ```bash
    pnpm run seed
    ```

5. **Lancement du serveur** :
    ```bash
    npm run dev
    ```
    *ou*
    ```bash
    pnpm run dev
    ```


## Documentations des commandes :

- [**Help**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/help.md)
  
- [**Balance**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/balance.md)
  
- [**Send**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/send.md)

- [**Generate**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/generate.md)

- [**Leaderboard**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/leaderboard.md)

- [**Public Leaderboard**](https://github.com/discord-bot-points/Points-Discord/blob/main/src/Commands/Docs/publicLeaderboard.md)

## Contributeurs :
Merci à tous ceux qui ont contribué à ce projet !
- [Alexia Scherer](https://github.com/evarellapucky)
- [Yann Rezigui](https://github.com/YannRZG)
- [Raphaël Marcarini](https://github.com/Marcaraph)
- [Jeremie Olivier](https://github.com/jeremie-olivier)
- [Malo Bastianelli](https://github.com/Korblen)
- [Tommy Pellerin](https://github.com/tommy-pellerin)
- [Sasha Godel](https://github.com/MacDuPain)
