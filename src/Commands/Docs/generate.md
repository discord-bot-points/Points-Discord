# Commande `/generate`

### Description

Cette commande permet à un utilisateur (administrateur ou délégué) de générer des points et de les envoyer à un autre utilisateur dans un domaine sépcifique. La commande vérifie l'existence des utilisateurs et du domaine, met à jour les informations pertinentes (comme les avatars), crée une transaction, et enregistre les logs dans un canal spécifique. Une confirmation de la transaction est envoyée à l'utilisateur ainsi qu'une mise à jour de son solde de points.

### Structure 
```ts
/generate user:<@user> points:<integer> domain:<string> description:<string> link:<string> référence:<integer>
```

### Paramètres
- `user` (**obligatoire**) : Le destinataire (`receiver`) des points générés.
- `points` (**obligatoire**) : Le nombre de points à générer pour l'utilisateur spécifié.
- `domain` (**obligatoire**) : Le domaine dans lequel les points sont générés. Ce domaine doit exister dans la base de données.
- `description` (**facultatif**) : Une description facultative pour préciser les raisons de la génération des points.
- `link` (**facultatif**) : Un lien facultatif à inclure, qui peut être utilisé pour fournir des informations supplémentaires.
- `référence` (**facultatif**) : Un identifiant de transaction optionnel qui permet de lier la nouvelle transaction à une autre transaction existante.


### Fonctionnalité

1. Vérification des utilisateurs :
Lors de l'exécution de la commande, le système vérifie si les utilisateurs (`sender` et `receiver`) existent déjà dans la base de données. Si un utilisateur n'existe pas, il est créé avec un solde initial de `points` égal à zéro.

2. Vérification des avatars :
Les avatars des utilisateurs sont vérifiés à chaque commande. Si l'avatar a changé, la base de données est mise à jour avec la nouvelle image.

3. Validation du domaine :
La commande vérifie si le `domain` fourni existe dans la base de données. S'il n'existe pas, la commande retourne une erreur avec la liste des domaines valides.

4. Création de la transaction :
Une fois les vérifications effectuées, une nouvelle transaction est créée. Cette transaction enregistre les informations suivantes : `sender`, destinataire, domaine, points, description et lien.

5. Mise à jour des soldes :
Le solde de l'utilisateur destinataire est mis à jour en fonction des points générés.

6. Logs de la transaction :
Un message détaillé de la transaction est envoyé dans un canal de logs configuré pour garder une trace des opérations.


### Embeds 

1. Embed de confirmation (`generateEmbed`) :
Un embed est généré pour informer l'utilisateur de la transaction réussie. Cet embed contient :
- Le domaine de la transaction.
- Le nombre de points envoyés.
- Une description, si elle a été fournie.
- Un lien, si présent.

2. Embed de solde mis à jour (`updatedBalanceEmbed`) :
Cet embed montre l'ancien solde de l'utilisateur et son nouveau solde après l'ajout des points.

3. Embed de logs (`logsEmbed`) :
Un embed similaire à l'embed de confirmation est envoyé dans un canal spécifique pour enregistrer l'opération. Il contient tous les détails de la transaction pour assurer un suivi dans l'historique.

### Gestion des erreurs

- **Utilisateur non trouvé** : Si l'utilisateur cible n'est pas spécifié ou est invalide, un message d'erreur est renvoyé indiquant "User not found".
  
- **Domaine invalide** : Si le domaine fourni n'existe pas dans la base de données, une erreur est renvoyée avec la liste des domaines valides.

- **Erreur lors de la création de la transaction** : En cas d'échec de la création de la transaction, un message d'erreur générique est envoyé, demandant à l'utilisateur de consulter les logs pour plus de détails.