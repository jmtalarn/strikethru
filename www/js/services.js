angular.module('strikethru.services', [])
  .factory('Todos', function() {

    var todos = [{
        "id": 1,
        "title": "vitae",
        "description": "diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu",
        "date": new Date(2018, 03, 06),
        "done":false
      },
      {
        "id": 2,
        "title": "interdum feugiat. Sed nec metus",
        "description": "enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac",
        "date": new Date(2017, 09, 06),
        "done": true
      },
      {
        "id": 3,
        "title": "vehicula et, rutrum eu, ultrices",
        "description": "ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur",
        "date": new Date(2017, 07, 14),
        "done": true
      },
      {
        "id": 4,
        "title": "Nullam suscipit,",
        "description": "lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis",
        "date": new Date(2017, 07, 02),
        "done":false
      },
      {
        "id": 5,
        "title": "odio",
        "description": "a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu",
        "date": new Date(2016, 07, 26),
        "done":false
      },
      {
        "id": 6,
        "title": "sagittis. Nullam vitae diam. Proin",
        "description": "Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante dictum cursus.",
        "date": new Date(2017, 02, 13),
        "done":false
      },
      {
        "id": 7,
        "title": "arcu eu odio tristique pharetra.",
        "description": "scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna justo faucibus lectus, a sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed",
        "date": new Date(2017, 11, 05),
        "done":false
      },
      {
        "id": 8,
        "title": "ultrices. Vivamus rhoncus. Donec est. Nunc",
        "description": "nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris",
        "date": new Date(2016, 04, 13),
        "done":true
      },
      {
        "id": 9,
        "title": "ligula tortor, dictum eu, placerat",
        "description": "vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus",
        "date": new Date(2018, 01, 09),
        "done":true
      },
      {
        "id": 10,
        "title": "malesuada fames ac turpis egestas.",
        "description": "lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque",
        "date": new Date(2017, 04, 21)
      },
      {
        "id": 11,
        "title": "ligula eu enim. Etiam imperdiet",
        "description": "Curae; Donec tincidunt. Donec vitae erat vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin",
        "date": new Date(2016, 08, 02)
      },
    ];

    return {
      all: function() {
        return todos;
      },
      remove: function(todo) {
        todos.splice(todos.indexOf(todo), 1);
      },
      get: function(todoId) {
        for (var i = 0; i < todos.length; i++) {
          if (todos[i].id === parseInt(todoId)) {
            return todos[i];
          }
        }
        return null;
      },
      save: function(todo){
        if (todo.id){
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === parseInt(todo.id)) {
              todos[i]=todo;
              return true;
            }
          }
        }else{
          var maxId = todos.reduce(function (p, v) {
            return ( p.id > v.id ? p.id : v.id );
          });
          todo.id = maxId + 1;
          todos.push(todo);
          return true
        }
        return false;
      }
    };
  })
  .factory('Vault', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var vaultItems = [{
      id: 1,
      name: 'Grocery list',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus quis sapien volutpat consequat vitae vel ex. Proin molestie magna vel mi finibus, sit amet suscipit libero pulvinar. Nulla suscipit placerat molestie. Suspendisse volutpat interdum felis eget fringilla. Vivamus sit amet lobortis metus. Quisque in tincidunt arcu. Nulla eget ante dolor. Maecenas tellus ipsum, ultrices placerat bibendum id, volutpat non enim. Nam eget tellus nisl. Nullam eget nibh at nisi rhoncus venenatis gravida sed eros. Ut sed lorem turpis. Ut sapien lectus, eleifend quis consectetur sed, efficitur et ipsum. Etiam id nisl at lorem interdum commodo in vitae quam.',
      label: 'Gr'
    }, {
      id: 2,
      name: 'Monthly list',
      description: 'Ut nec mattis ante, vitae maximus dolor. Maecenas volutpat arcu eget sollicitudin placerat. Etiam nec eros venenatis eros volutpat congue. Aenean sit amet risus non massa molestie gravida vitae at sapien. Integer ac laoreet dolor, sit amet gravida sapien. Donec eu volutpat nunc. Etiam a convallis lacus, et feugiat sem. Maecenas finibus id diam non imperdiet. Donec laoreet augue ut ante rhoncus, nec eleifend erat ornare. Integer eu suscipit purus. Donec viverra auctor tellus, eget sodales nibh malesuada quis.',
      label: 'Mo'
    }, {
      id: 3,
      name: 'Goals',
      description: 'Suspendisse potenti. Nam ullamcorper tristique dui ut lacinia. Integer massa massa, interdum in vulputate quis, semper ullamcorper nisi. Aenean at euismod arcu. Mauris eu molestie turpis, sit amet pharetra purus. Mauris mattis cursus ante, at aliquet turpis pulvinar sit amet. Nulla nulla ante, venenatis nec sollicitudin quis, fermentum quis leo. Suspendisse non augue augue. Suspendisse venenatis ipsum vitae varius mollis. Praesent semper sapien vel finibus egestas. Maecenas ultrices felis at laoreet faucibus. Sed facilisis ultricies diam, molestie interdum quam commodo nec.',
      label: 'Go'
    }];

    return {
      all: function() {
        return vaultItems;
      },
      remove: function(vault) {
        vaultItems.splice(vaultItems.indexOf(vault), 1);
      },
      get: function(vaultId) {
        for (var i = 0; i < vaultItems.length; i++) {
          if (vaultItems[i].id === parseInt(vaultId)) {
            return vaultItems[i];
          }
        }
        return null;
      },
      save: function(vault) {
        if (vault.id){
          for (var i = 0; i < vaultItems.length; i++) {
            if (vaultItems[i].id === parseInt(vault.id)) {
              vaultItems[i]=vault;
              return true;
            }
          }
        }else{
          var maxId = vaultItems.reduce(function (p, v) {
            return ( p.id > v.id ? p.id : v.id );
          });
          vault.id = maxId + 1;
          vaultItems.push(vault);
          return true
        }
        return false;
      }
    };
  });
