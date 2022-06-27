<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="200px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Cars Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="mx-4 mt-6"></v-divider>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="cars" :search="search">
                        <template v-slot:[`item.url_car_img`]="{ item }">
                            <v-img class="my-3" width="200px" height="100px" :src="$imgloader+item.url_car_img"></v-img>
                        </template> 
                    </v-data-table> 
                </v-card>
            </v-row>
        </v-container>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .posisinya{
        position: absolute; 
        top: 10px; 
        left: 0; 
        right: 0;
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }

    .formtxt{
        font-family: Rubik;
    }

    .headline{
        font-family: Akshar;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }
</style>

<script> 
    export default {
        name: "DataCar",
        data() { 
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null, 
                dialog: false, 
                dialogConfirm: false,
                headers: [
                    {text: "Car Image", value: "url_car_img"},
                    {text: "Name", value: "nama_mobil"},
                    {text: "Car Type", value: "tipe_mobil"},
                    {text: "Transmision", value: "jenis_transmisi"},
                    {text: "Fuel", value: "jenis_bahan_bakar"},
                    {text: "Color", value: "warna_mobil"},
                    {text: "Baggage", value: "vol_bagasi"},
                    {text: "Fasility", value: "fasilitas_mobil"},
                    {text: "Daily Rent Cost", value: "tarif_harian_mobil"},
                ],
                car: new FormData,
                cars: [],
                btnShow: false,
            };
        },


        methods: { 
            readData() {
                var url = this.$api + '/listcar';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.cars = response.data.data_array;
                })
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>