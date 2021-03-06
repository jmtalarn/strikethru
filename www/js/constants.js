angular.module('strikethru.constants', [])
.constant("LABELS", {
  "DELETE":{
    "TODO": {
      "TITLE": "Delete",
      "TEMPLATE": "Are you sure you want to delete this task?"
    },
    "VAULT" : {
      "TITLE": "Delete",
      "TEMPLATE": "Are you sure you want to delete this Vault category?"
    },
    "CLEAR" : {
      "TITLE": "Clear done tasks",
      "TEMPLATE": "Are you sure you want to delete all the done tasks?"
    }
  }})
  .constant("SETUP", {
    "STRIKETHRU" : {
      "Lite" :  1000 ,
      "Standard" :  2000 ,
      "Pro" : 3000 }
    });
