<template>
    <div>
        <v-navigation-drawer app class="indigo accent-1" v-model="drawer" :mini-variant.sync="mini" permanent>
            <v-list-item class="px-2">
                <v-list-item-avatar width="20px">
                    <v-img large :src="require('@/assets/ajr_logo.png')"></v-img>
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
                <v-img :src="$imgloader+user.url_pp_customer"></v-img>
            </v-avatar>
            <span class="username font-weight-bold primary--text ml-2">Hi, {{ user.nama_customer }}</span>
            <v-btn @click="logout" class="mx-2" fab dark small color="indigo" >
                <v-icon color="yellow">mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <div app class="content">
            <router-view></router-view>
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
    name: "CustomerPage",
    data () {
        return {
            user: [],
            drawer: true,
            items: [
            { title: 'My Account', icon: 'mdi-account', to: '/myProfileCust' },
            { title: 'Transaction', icon: 'mdi-cart', to: '/myTransaction' },
            { title: 'Car', icon: 'mdi-car-side', to: '/listCar' },
            { title: 'Promo', icon: 'mdi-ticket-percent', to:'/listPromo' },
            ],
            mini: true,
            userId: localStorage.getItem('id'),
            logoutIdentifier: new FormData,
        }
    },

    methods: {
        readData() {
            var url = this.$api + '/user/' + this.userId;
            this.$http.get(url, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.user = response.data.data;
            })
        },

        logout(){
            this.logoutIdentifier.append('guard','user')
            var url = this.$api + '/logout';
            this.$http.post(url, this.logoutIdentifier, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            })
            localStorage.removeItem('token');
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