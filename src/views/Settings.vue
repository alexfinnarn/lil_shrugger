<template>
  <div class="panel panel-default">
    <message-area></message-area>
    <div class="panel-heading">
      <h4>User Settings</h4>
    </div>
    <form class="row panel-body">
      <div v-if="userAccessPerm('credentials')">
        <fieldset class="form-group">
          <label for="username">Atlas Username</label>
          <input type="text" id="username" class="form-control" name="username" v-model="username">
          <label for="password">Atlas Password</label>
          <input type="password" id="password" class="form-control" name="password" v-model="password">
        </fieldset>
        <fieldset class="form-group">
          <label for="github-username">GitHub Username</label>
          <input type="text" id="github-username" class="form-control" name="github-username" v-model="gitHub.username">
          <label for="github-token">GitHub Token</label>
          <input type="text" id="github-token" class="form-control" name="github-token" v-model="gitHub.token">
          <p class="form-text text-muted">
            Need to setup
            <a href="https://github.com/settings/tokens">https://github.com/settings/tokens</a> under Personal access tokens.
          </p>
        </fieldset>
      </div>
      <fieldset class="form-group">
        <label for="sites-query">Sites Query</label>
        <input type="text" id="sites-query" class="form-control" name="sites-query" v-model="sitesQuery">
        <label for="destination-link">Sites Destination Link</label>
          <input type="text" id="destination-link" class="form-control" name="destination-link" v-model="destinationLink">
          <p class="form-text text-muted">
            The destination link is where the user goes after logging into the site, e.g. "admin/people/invite".
          </p>
        <label for="code-query">Code Query</label>
        <input type="text" id="code-query" class="form-control" name="code-query" v-model="codeQuery">
      </fieldset>
      <fieldset class="form-group">
        <label for="reports-delimiter">Reports Delimiter</label>
        <input type="text" id="reports-delimiter" class="form-control" name="reports-delimiter" v-model="reportsDelimiter">
        <p class="form-text text-muted">
          You can choose the delimiter that is used when generating reports like emails. For example, "\n" will make each item
          appear on a new line instead of placing a comma between items as is the default.
        </p>
        <h4>Repositories Listing</h4>
        <p class="form-text text-muted">
          You can choose to have the repository list for creating code be chronologically by updated date instead of alphabetically.
        </p>
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" id="chronological" v-model="repoListing">
            Chronological
          </label>
        </div>
        <h4>Default Sites Page Components</h4>
        <p class="form-text text-muted">
          Choose which components you want loaded on the Sites page. The default is only "StatsSearch".
        </p>
        <div class="form-check checkbox-inline"
             :key="'list-' + comp"
             v-for="comp in sitesComponents">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :id="'list-' + comp" :value="comp" v-model="saveDefaultSitesComponents">
            {{comp}}
          </label>
        </div>
        <h4>Site Record Keys</h4>
        <p class="form-text text-muted">
          Choose which keys you want to include in the site record listing.
        </p>
        <div class="form-check checkbox-inline"
              :key="'sites' + key"
              v-for="key in siteKeys">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :id="'site-' + key" :value="key" v-model="saveSiteKeys">
            {{key}}
          </label>
        </div>
        <h4>Stats Record Keys</h4>
        <p class="form-text text-muted">
          Choose which keys you want to include in the site record listing.
        </p>
        <div class="form-check checkbox-inline"
              :key="'stats-' + key"
              v-for="key in statsKeys">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :id="'stats-' + key" :value="key" v-model="saveStatsKeys">
            {{key}}
          </label>
        </div>
        <h4>Code Record Keys</h4>
        <p class="form-text text-muted">
          Choose which keys you want to include in the code record listing.
        </p>
        <div class="form-check checkbox-inline"
              :key="'code-' + key"
              v-for="key in codeKeys">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :id="'code-' + key" :value="key" v-model="saveCodeKeys">
            {{key}}
          </label>
        </div>
        <div v-if="userAccessPerm('developerMode')">
          <h4>Developer</h4>
          <p class="form-text text-muted">
            These settings only apply to developers who have write access to Atlas.
          </p>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" v-model="developerMode">
              Developer Mode
            </label>
          </div>
        </div>
      </fieldset>
      <button @click="saveCreds()" type="button" class="btn btn-primary" aria-label="Save">Save</button>
      <button @click="clearStorage()" type="button" class="btn btn-danger" aria-label="Clear Local Storage">Clear Local Storage</button>
    </form>
  </div>
</template>

<script>
  import shrugger from '../services/shrugger.ts';
  import store from '../store.ts';
  import bus from '../services/bus.ts';

  export default {
    name: 'Settings',
    data() {
      return {
        username: localStorage.getItem('atlas-username') ? localStorage.getItem('atlas-username') : '',
        password: localStorage.getItem('atlas-password') ? localStorage.getItem('atlas-password') : '',
        baseURL: localStorage.getItem('baseURL') ? localStorage.getItem('baseURL') : '/shrugger',
        destinationLink: localStorage.getItem('destination-link') ? localStorage.getItem('destination-link') : store.state.defaultDestinationLink,
        gitHub: {
          username: localStorage.getItem('github-username') ? localStorage.getItem('github-username') : '',
          token: localStorage.getItem('github-token') ? localStorage.getItem('github-token') : '',
        },
        sitesQuery: localStorage.getItem('sites-query') ? localStorage.getItem('sites-query') : store.state.defaultSitesQuery,
        codeQuery: localStorage.getItem('code-query') ? localStorage.getItem('code-query') : '',
        repoListing: localStorage.getItem('repo-listing') ? JSON.parse(localStorage.getItem('repo-listing')) : false,
        reportsDelimiter: localStorage.getItem('reports-delimiter') ? localStorage.getItem('reports-delimiter') : store.state.defaultReportsDelimiter,
        developerMode: localStorage.getItem('developer-mode') ? JSON.parse(localStorage.getItem('developer-mode')) : false,
        saveDefaultSitesComponents: localStorage.getItem('default-sites-components') ? JSON.parse(localStorage.getItem('default-sites-components')) :
          store.state.defaultSitesComponents,
        saveSiteKeys: localStorage.getItem('site-keys') ? JSON.parse(localStorage.getItem('site-keys')) : store.state.defaultSelectedSitesKeys,
        saveCodeKeys: localStorage.getItem('code-keys') ? JSON.parse(localStorage.getItem('code-keys')) : store.state.defaultSelectedCodeKeys,
        saveStatsKeys: localStorage.getItem('stats-keys') ? JSON.parse(localStorage.getItem('stats-keys')) : [],
      };
    },
    computed: {
      siteKeys() {
        return this.sortKeys(store.state.siteKeys);
      },
      codeKeys() {
        return this.sortKeys(store.state.codeKeys);
      },
      sitesComponents() {
        return this.sortKeys(store.state.sitesComponents);
      },
      statsKeys() {
        return this.sortKeys(store.state.statsKeys);
      },
    },
    methods: {
      saveCreds() {
        localStorage.setItem('atlas-username', this.username);
        localStorage.setItem('atlas-password', this.password);
        localStorage.setItem('baseURL', this.baseURL);
        localStorage.setItem('destination-link', this.destinationLink);
        localStorage.setItem('github-username', this.gitHub.username);
        localStorage.setItem('github-token', this.gitHub.token);
        localStorage.setItem('sites-query', this.sitesQuery);
        localStorage.setItem('reports-delimiter', this.reportsDelimiter);
        localStorage.setItem('code-query', this.codeQuery);
        localStorage.setItem('repo-listing', JSON.stringify(this.repoListing));
        localStorage.setItem('developer-mode', JSON.stringify(this.developerMode));
        localStorage.setItem('code-keys', JSON.stringify(this.saveCodeKeys));
        localStorage.setItem('default-sites-components', JSON.stringify(this.saveDefaultSitesComponents));
        localStorage.setItem('site-keys', JSON.stringify(this.saveSiteKeys));
        localStorage.setItem('stats-keys', JSON.stringify(this.saveStatsKeys));

        // Change developer mode.
        store.commit('editDeveloperMode', this.developerMode);

        bus.$emit('onMessage', {
          text: 'Saved credentials.',
          alertType: 'alert-success',
        });
      },
      clearStorage() {
        localStorage.clear();

        // Wait in case localStorage needs a little time to clear.
        shrugger.wait(1500);

        bus.$emit('onMessage', {
          text: 'Cleared local storage.',
          alertType: 'alert-success',
        });

        // This is duplicated from the data object.
        // @todo abstract to one function.
        this.username = localStorage.getItem('atlas-username') ? localStorage.getItem('atlas-username') : '';
        this.password = localStorage.getItem('atlas-password') ? localStorage.getItem('atlas-password') : '';
        this.baseURL = localStorage.getItem('baseURL') ? localStorage.getItem('baseURL') : '/shrugger';
        this.gitHub = {
          username: localStorage.getItem('github-username') ? localStorage.getItem('github-username') : '',
          token: localStorage.getItem('github-token') ? localStorage.getItem('github-token') : '',
        };
        this.sitesQuery = localStorage.getItem('sites-query') ? localStorage.getItem('sites-query') : store.state.defaultSitesQuery;
        this.codeQuery = localStorage.getItem('code-query') ? localStorage.getItem('code-query') : '';
        this.repoListing = localStorage.getItem('repo-listing') ? JSON.parse(localStorage.getItem('repo-listing')) : false;
        this.reportsDelimiter = localStorage.getItem('reports-delimiter') ? localStorage.getItem('reports-delimiter') : store.state.defaultReportsDelimiter;
        this.saveDefaultSitesComponents = localStorage.getItem('default-sites-components') ? JSON.parse(localStorage.getItem('default-sites-components')) :
          store.state.defaultSitesComponents;
        this.saveSiteKeys = localStorage.getItem('site-keys') ? JSON.parse(localStorage.getItem('site-keys')) : store.state.defaultSelectedSitesKeys;
        this.saveCodeKeys = localStorage.getItem('code-keys') ? JSON.parse(localStorage.getItem('code-keys')) : store.state.defaultSelectedCodeKeys;
        this.saveStatsKeys = localStorage.getItem('stats-keys') ? JSON.parse(localStorage.getItem('stats-keys')) : [];
      },
      userAccessPerm(permission) {
        return shrugger.userAccess(permission);
      },
      sortKeys(keys) {
        const sortOptions = {
          sensitivity: 'base',
          numeric: true,
        };
        return keys.sort((a, b) => b.localeCompare(a, 'en', sortOptions) * -1);
      },
    },
  };
</script>

<style scoped>

.checkbox-inline {
  margin-left: 0px;
  margin-right: 10px;
}

</style>
