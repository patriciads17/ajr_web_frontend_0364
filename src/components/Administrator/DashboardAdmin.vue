<template>
    <div>
        <v-navigation-drawer app class="indigo accent-1" v-model="drawer" :mini-variant.sync="mini" permanent>
            <v-list-item class="px-2">
                <v-list-item-avatar width="20px">
                    <v-img :src="require('@/assets/ajr_logo.png')"></v-img>
                </v-list-item-avatar>

                <v-list-item-title>
                    <span class="listtitle font-weight-bold yellow--text">Atma Jaya Rental</span>
                </v-list-item-title>

                <v-btn icon @click.stop="mini = !mini">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" link tag="router-link" :to="item.to">
                    <v-list-item-icon class="mt-5 mb-5">
                        <v-icon color="yellow">{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="iconname font-weight-bold">{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app height="56px" color="white">
            <v-spacer></v-spacer>
            <v-avatar size="40">
                <v-img :src="$imgloader+employee.url_foto_pegawai"></v-img>
            </v-avatar>
            <span class="username font-weight-bold primary--text ml-2">Hi, {{ employee.nama_pegawai }}</span>
            <v-btn @click="logout" class="mx-2" fab dark small color="indigo" >
                <v-icon color="yellow">mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <div app class="content">
            <router-view>
                <v-card>
                </v-card>
            </router-view>
        </div>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

     .listtitle{
        font-family: Akshar;
        font-size: 20px;
    }

    .username{
        font-family: Akshar;
        font-size: 20px;
    }

    .iconname{
        font-family: Rubik;
    }
</style>

<script>
  export default {
    name: "AdminPage",
    data () {
        return {
            employee: [],
            drawer: true,
            items: [
            { title: 'My Profile', icon: 'mdi-account', to: '/myProfileAdmin' },
            { title: 'Data Employee', icon: 'mdi-account-tie', to: '/tableEmployee' },
            { title: 'Data Driver', icon: 'mdi-steering', to: '/tableDriver' },
            { title: 'Data Car', icon: 'mdi-car', to: '/tableCar' },
            { title: 'Data Partner', icon: 'mdi-handshake', to: '/tablePartner' },
            ],
            mini: true,
            logoutIdentifier: new FormData,
        }
    },

    methods: {
        readData() {
            var url = this.$api + '/employee/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.employee = response.data.data;
            })
        },
        logout(){
            this.logoutIdentifier.append('guard','employee')
            var url = this.$api + '/logout';
            this.$http.post(url, this.logoutIdentifier, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            })
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('idRole');
            this.$router.push({
                name: 'IndexPage'
            });
            
        }
    },

    mounted() {
        this.readData();
    },
  }
</script>