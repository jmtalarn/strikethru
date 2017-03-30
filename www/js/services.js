angular.module('strikethru.services', [])
.factory('Todos', function() {

  var todos = [{
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
    },
    {
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
    },
    {
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
    },
    {
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
    },
    {
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
    },
    {
      id: 1,
      title: "AAAAAAAAAAA",
      description: " AAAAAAAAAAAAAAAAA",
      date: new Date()
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
    }
  };
})
.factory('Vault', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var vaultItems = [{
    id: 0,
    name: 'Grocery list',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus quis sapien volutpat consequat vitae vel ex. Proin molestie magna vel mi finibus, sit amet suscipit libero pulvinar. Nulla suscipit placerat molestie. Suspendisse volutpat interdum felis eget fringilla. Vivamus sit amet lobortis metus. Quisque in tincidunt arcu. Nulla eget ante dolor. Maecenas tellus ipsum, ultrices placerat bibendum id, volutpat non enim. Nam eget tellus nisl. Nullam eget nibh at nisi rhoncus venenatis gravida sed eros. Ut sed lorem turpis. Ut sapien lectus, eleifend quis consectetur sed, efficitur et ipsum. Etiam id nisl at lorem interdum commodo in vitae quam.',
    label: 'Gr'
  },{
    id: 1,
    name: 'Monthly list',
    description: 'Ut nec mattis ante, vitae maximus dolor. Maecenas volutpat arcu eget sollicitudin placerat. Etiam nec eros venenatis eros volutpat congue. Aenean sit amet risus non massa molestie gravida vitae at sapien. Integer ac laoreet dolor, sit amet gravida sapien. Donec eu volutpat nunc. Etiam a convallis lacus, et feugiat sem. Maecenas finibus id diam non imperdiet. Donec laoreet augue ut ante rhoncus, nec eleifend erat ornare. Integer eu suscipit purus. Donec viverra auctor tellus, eget sodales nibh malesuada quis.',
    label: 'Mo'
  },{
    id: 2,
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
    }
  };
});
