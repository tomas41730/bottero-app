<template>
  <crud-users/>
</template>

<script>
import CrudUsers from '../components/UsersCRUD.vue'
  export default {
    name: 'Users',

    components: {
        CrudUsers,
    },
  }
</script>
