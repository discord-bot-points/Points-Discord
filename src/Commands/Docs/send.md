# Commande `/send`

### Description
La commande `/send` permet à un utilisateur d'envoyer un certain nombre de points à un autre utilisateur sur le serveur Discord. Elle permet également de suivre les transactions dans un canal de logs dédié.

### Structure

```ts
/send user:<@user> points:<integer> domain:<string> transaction:<Personelle/THP> description:<string> [link:<string>] 
```

### Paramètres

- `user` (**obligatoire**) : Mention de l'utilisateur qui recevra les points.
- `points` (**obligatoire**) : Le nombre de points à envoyer à l'utilisateur spécifié.
- `domain` (**obligatoire**) : Le domaine auquel la transaction est lié. Si le domaine n'existe pas, la commande retournera une erreur avec une liste de domaines valides.
- `transaction` (**obligatoire**) : Le type de la transaction : soit `Personelle` pour une utilisation personnelle (sans remboursement) soit `THP` pour une utilisation pédagogique (avec remboursement).
- `description` (**obligatoire**) : Une description de la transaction.
- `link` (optionnel) : Un lien facultatif associé à la transaction. A utiliser pour répondre à un message précis dans un canal discord.

### Fonctionnalité

1. Vérification des utilisateurs :

    - La commande vérifie si l'utilisateur qui envoie les points (`sender`) et l'utilisateur qui les reçoit (`receiver`) existent dans la base de données Prisma. Si l'un des deux n'existe pas, il est créé avec un solde initial de `0` points.
    - Si l'avatar Discord de l'utilisateur est différent de celui enregistré dans la base de données Prisma, il est mis à jour.

2. Vérification du domaine :

    - La commande vérifie que le domaine existe dans la base de données. Si ce n'est pas le cas, elle renvoie un message avec la liste des domaines existants (Ne devrait pas apparaître puisque la liste des domaines provient de Prisma directement).

3. Vérification du solde :

    - La commande compare le solde de l'utilisateur `sender` avec les points à envoyer. Si l'utilisateur n'a pas assez de points, un message d'erreur est renvoyé.

4. Mise à jour des soldes :

    - Si toutes les vérifications passent, les soldes des deux utilisateurs sont mis à jour : le solde du `sender` est décrémenté tandis que celui du `receiver` est incrémenté.

5. Enregistrement de la transaction :

    - Une nouvelle transaction est créée dans la base de données Prisma avec les informations suivantes : `senderId`, `receiverId`, `points`, `description`, `link` (si existant), `domainId` et le type de la transaction `usage`.

6. Affichage des résultats :

    - **Embed de la transaction** : Un message est envoyé dans le canal où la commande a été appelée, contenant un résumé de la transaction.
    - **Embed de mise à jour du solde** : Un second message est envoyé à l'utilisateur exécutant la commande, avec une mise à jour de son solde et celui du destinataire (éphemeral).
    - **Embed de logs** : Une copie de l'embed de la transaction est envoyé dans un canal de logs spécifique pour garder une trace des transactions.

### Embeds

1. `tradeEmbed` :
    - Embed affiché à tous les utilisateurs du canal où la commande est utilisée.
    - Contient les utilisateurs `sender` et `receiver`, le montant de points envoyés, le domaine selectionné, la description de la transaction et, si disponible, un lien lié à la transaction.

2. `updatedBalanceEmbed` (*éphémère*) :
    - Embed affiché uniquement à l'utilisateur exécutant la commande, avec une mise à jour de son solde ainsi que celui du destinataire.

3. `logsEmbed` :
    - Copie du tradeEmbed envoyé dans un canal dédié.     

### Gestion des erreurs

  - **Utilisateur ou domain non trouvé** : Si l'utilisateur cible ou le domaine est introuvable dans la base de données, un message d'erreur est envoyé à l'utilisateur sous forme d'un message éphémère.

  - **Solde insuffisant** : Si l'utilisateur n'a pas assez de points pour effectuer la transaction, un message d'erreur est renvoyé.

  - **Problème de base de données** : Si une erreur survient lors de la création ou de la mise à jour des enregistrements dans la base de données, un message d'erreur est renvoyé à l'utilisateur, et l'erreur est loguée sur la console.

### Exemple d'utilisation

```bash
/send user:@Utilisateur points:50 domain:Développement transaction:Personelle description:"Révision de code" link:"https://github.com/owner/repo" 
```

  - Cet exemple enverra 50 points à l'utilisateur mentionné dans le domaine "Développement", avec la description "Révision de code" et un lien vers un repo Github. Cette transaction est personnelle.