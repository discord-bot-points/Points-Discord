# Documentation : Commande `/balance` du bot Discord

## Table des matières
1. Aperçu général
2. Fonctionnement de la commande
3. Utilisation de Prisma
4. Création et envoi d'un Embed
5. Gestion des erreurs

## 1. Aperçu général

Cette commande permet à un utilisateur de consulter la balance de points d'un utilisateur Discord. Si aucun utilisateur n'est spécifié, la commande retourne la balance de l'utilisateur qui a exécuté la commande. Le bot utilise [Prisma](https://www.prisma.io/) pour interagir avec une base de données, et la méthode `SlashCommandBuilder` de Discord.js pour définir la commande.

## 2. Fonctionnement de la commande

**Commande**

La commande /balance permet d'afficher la balance de points.
L'option user est facultative. Si elle n'est pas spécifiée, la balance de l'utilisateur qui a lancé la commande sera affichée.

**Exécution de la commande**

L'utilisateur spécifié dans l'option user est récupéré. Si aucun utilisateur n'est spécifié, c'est l'utilisateur exécutant la commande qui est utilisé.
Le nom d'utilisateur est transformé en minuscule pour standardiser les requêtes à la base de données.

## 3. Utilisation de Prisma

**Requête pour trouver l'utilisateur**

findUnique recherche un utilisateur dans la base de données à partir du nom d'utilisateur Discord. Si l'utilisateur n'est pas trouvé, la commande créera une nouvelle entrée.

**Création d'un nouvel utilisateur**

Si l'utilisateur n'existe pas dans la base de données, Prisma en crée un avec une balance par défaut de 0.

## 4. Création et envoi d'un Embed

**Embed personnalisé**

Un Embed est utilisé pour afficher la balance de manière esthétique. Le nom d'utilisateur et l'ID Discord sont insérés dynamiquement pour personnaliser l'affichage.
La couleur de l'embed est définie à 4772300 et l'auteur de l'embed est configuré avec un logo et un lien.

**Réponse de l'interaction**

La réponse est envoyée sous forme d'embed et est définie comme ephemeral, ce qui signifie qu'elle ne sera visible que par l'utilisateur ayant exécuté la commande.

## 5. Gestion des erreurs

En cas d'erreur lors de la récupération des données utilisateur ou de la création d'un nouvel utilisateur, une erreur est loguée et une réponse ephemeral est envoyée à l'utilisateur pour l'informer que quelque chose s'est mal passé.

# Exemple d'utilisation

Un utilisateur peut taper /balance pour voir sa propre balance.
Un utilisateur peut aussi taper /balance user:@nomdutilisateur pour voir la balance d'un autre utilisateur Discord.