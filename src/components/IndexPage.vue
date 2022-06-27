<template>
    <div> 
        <div class="indigo lighten-3 ">
            <v-app-bar height="100px" rounded app absolute class="app-header transparent" flat elevate-on-scroll>
                <v-container>
                    <v-img :src="require('@/assets/ajr_logo.png')" alt="AJR Logo" height="80px" width="80px"></v-img>
                </v-container>
                <v-spacer></v-spacer>
            </v-app-bar>

            <div class="banner-wrapper">
                <v-container>
                    <v-row>
                        <v-col class="d-flex align-center justify-center" cols="12" md="5" lg="6">
                            <v-img
                                :src="require('@/assets/ajr_lp.png')" alt="banner"/>
                        </v-col>
                        <v-col cols="12" md="7" lg="6" class="d-flex align-center justify-center">
                            <div class="text-center text-md-left">
                                <h1 class="banner-title font-weight-bold" style="color:#FFEB3B">
                                    NEED TO RENT A CAR?
                                </h1>
                                <h4 class="banner-subtitle font-weight-regular" style="color:#FFEB3B">
                                    Register now and get special discount!
                                </h4>
                                <div class="mt-12 pt-2 d-flex justify-center">
                                    <v-btn @click="sign_up" color="#3949AB" class="btn-text white--text r-0 mr-md-8 mb-5 mb-md-0 btn-custom-md" large target="_blank" elevation="0">
                                        Register Now!
                                    </v-btn>
                                    <v-btn @click="sign_in" class="btn-text indigo--text btn-custom-md font-weight-bold" large color="yellow" elevation="0">
                                        Log In
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </div>

        <div class="d-flex">
            <v-container align="center" justify="center">
                <v-row justify="center" class="mt-5">
                    <v-col cols="12" sm="10" md="9" lg="7">
                        <div class="text-center">
                        <h2 class="section-title font-weight-bold">
                            Why chosee AJR?
                        </h2>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="d-flex justify-center mt-13" align="center" justify="center">
                    <template v-for="(item, i) in items">
                        <v-col :key="i" cols="auto" >
                            <v-hover v-slot="{ hover }">
                                <v-card :elevation="hover ? 12 :2" :class="{ 'on-hover' : hover }" max-width="400" height="400px">
                                    <v-img :src="item.img" height="250px"></v-img>
                                    <v-card-title class="card-title orange--text">
                                        {{ item.title }}
                                    </v-card-title>
                                     <v-divider class="mx-4"></v-divider>
                                    <v-card-subtitle class="card-subtitle pb-0">
                                        {{ item.subtitle}}
                                    </v-card-subtitle>
                                </v-card>
                            </v-hover>
                        </v-col>
                    </template>
                </v-row>
            </v-container>
        </div>

        <div class="banner-wrapper yellow lighten-3" style="margin-top: 80px">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="7" lg="6" class="d-flex align-center justify-center">
                        <div class="text-center text-md-left">
                            <h1 class="banner-title font-weight-bold indigo--text">WANT TO BE YOUR OWN BOSS?</h1>
                            <h4 class="banner-subtitle indigo--text font-weight-regular">Come partner with us for flexibility in earning your own income</h4>
                            <div class="d-flex justify-center mt-12 pt-2">
                                <v-btn @click="regis" color="warning" class="d-flex justify-center btn-text r-0 mr-md-8 mb-5 mb-md-0 btn-custom-md" large target="_blank" elevation="0">Register Now!</v-btn>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="5" lg="6">
                        <v-img
                        :src="require('@/assets/ajr_driver.jpeg')" alt="banner"/>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .banner-wrapper {
        padding: 20px 0 20px;
        min-height: 400px;
        display: flex;
        align-items: center;
    }

    .btn-text{
        font-family: Rubik;
    }

    .banner-title {
        font-family: Rubik;
        font-size: 42px;
        line-height: 54px;
        margin: 10px 0 15px;
    }

    .banner-subtitle {
        font-family: Akshar;
        font-size: 21px;
    }

    .section-title {
        font-family: Akshar;
        font-size: 30px;
        margin: 20px 0 15px;
        line-height: 36px;
    }
    
    .card-title{
        font-size: 25px;
        font-family: Rubik;
    }
    .card-subtitle{
        font-family: Akshar;
        margin-bottom: 100px;
        font-size: 15px;
    }
</style>

<script>
  export default {
        name: "IndexPage",
        data () {
            return{
                items: [
                    {
                    title: 'Good Driver Good Trip',
                    subtitle: 'Enjoy your trip accompanied by an experienced driver who is ready to take you around the world',
                    img: require('@/assets/staycool.jpeg'),
                    },
                    {
                    title: 'Pocket Friendly',
                    subtitle: 'No need to worry about the price, we will always give you a special discount',
                    img: require('@/assets/pocketfriendly.jpg'),
                    },
                    {
                    title: 'New Day New Car',
                    subtitle: 'There are so many brands and types of cars that you can use for your trip',
                    img: require('@/assets/diffrentcar.jpg'),
                    },
                ],
            };
        },

        methods: {
            sign_up() {
                this.$router.push({
                    name: 'RegisterCustomer', 
                }); 
            },
            sign_in() {
                this.$router.push({
                    name: 'LoginPage', 
                }); 
            },
            regis() {
                this.$router.push({
                    name: 'RegisterDriver', 
                }); 
            },
        }
        
    }
</script>

