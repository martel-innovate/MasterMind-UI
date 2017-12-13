<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body has-text-centered">
        <h1 class="title">
          Welcome to MasterMind!
        </h1>
      </div>
    </section>
    <br/>
    <p>
      MasterMind is a management platform for FIWARE Data and IoT services, such as
      Context Brokers, IoT Agents, IoT Managers and so forth. It allows users to
      create individual projects with defined permissions per user, register Docker
      Swarm clusters to them in order to deploy or register IoT services, as well as
      registering and managing NSGI subscriptions.
    </p>
    <p>
      If you're a new user, you may proceed to the Projects page to create a new Project.
    </p>
  </div>
</template>

<script type = "text/javascript" >
  export default {}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
