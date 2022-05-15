<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1250px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="230px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Transactions Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="mx-4 mt-6"></v-divider>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="transactions" :search="search"> 
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
                                <v-icon dark>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_transaksi == 'Your payment is being processed! Waiting CS response' || item.status_transaksi == 'quest is being processed! Waiting CS response'" @click="acceptHandler(item)" class="mx-2 mr-2" fab dark x-small color="success">
                                <v-icon dark>mdi-check-bold</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_transaksi == 'Your payment is being processed! Waiting CS response' || item.status_transaksi == 'Your request is being processed! Waiting CS response'" @click="rejectHandler(item)" class="mx-2 mr-2" fab dark x-small color="error">
                                <v-icon dark>mdi-close-thick</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_transaksi == 'Your request has been accepted!'" @click="returnHandler(item)" class="mx-2 mr-2" fab dark x-small color="yellow">
                                <v-icon dark>mdi-car</v-icon>
                            </v-btn>
                        </template> 
                    </v-data-table> 
                </v-card>
                <v-dialog v-model="dialog" persistent width="1000px"> 
                    <v-card> 
                        <v-card-title>
                            <span class="headline">Transaction Detail: '{{ idTransaction }}' </span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <p class="headline indigo--text">Data Renting</p>
                                <v-text-field class="formtxt" v-model="form.jenis_transaksi" label="Date start" readonly></v-text-field>
                                <v-row>
                                    <v-col>
                                        <v-text-field class="formtxt" v-model="form.tgl_mulai_sewa" label="Date start" readonly></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field v-model="form.wkt_mulai_sewa" label="Time start" readonly></v-text-field>          
                                    </v-col>
                                </v-row>
                                <v-row class="mt-n2">
                                    <v-col>
                                        <v-text-field readonly class="formtxt" v-model="form.tgl_selesai_sewa" label="Date end" ></v-text-field>  
                                    </v-col>
                                    <v-col>
                                        <v-text-field v-model="form.wkt_selesai_sewa" label="Time end" readonly></v-text-field>      
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center">
                                    <v-card rounded="10" color="yellow" width="920px" max-height="220px">
                                        <v-card-title class="pengenaltxt">Selected Car</v-card-title>
                                        <v-row class="mx-3">
                                            <v-col cols="3">
                                                <v-img class="mb-3 mt-0" width="200px" height="130px" :src="$imgloader+selectedCarShow.url_car_img"></v-img>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.no_plat" label="Plat Number" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.nama_mobil" label="Name" readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.jenis_bahan_bakar" label="Fuel" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.tarif_harian_mobil" label="Daily Cost" readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.kapasitas_penumpang" label="Total Passanger" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.fasilitas_mobil" label="Facility" readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-row> 
                                <v-row v-if="form.jenis_transaksi == 'Car + Driver'" align="center" justify="center">
                                    <v-card rounded="10" color="yellow" width="900px" max-height="220px">
                                        <v-card-title class="pengenaltxt">Selected Drive</v-card-title>
                                        <v-row class="mx-3">
                                            <v-col cols="3">
                                                <v-img class="mb-3 mt-0" width="200px" height="130px" :src="$imgloader+selectedDriverShow.url_car_img"></v-img>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.no_plat" label="Plat Number" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.nama_mobil" label="Name" readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.jenis_bahan_bakar" label="Fuel" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.tarif_harian_mobil" label="Daily Cost" readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.kapasitas_penumpang" label="Total Passanger" readonly></v-text-field>
                                                <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.fasilitas_mobil" label="Facility" readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-row> 
                                <v-card class="mt-10 pa-0" color="black" height="2px" width="930px"></v-card>
                                <p class="headline indigo--text mt-5">Data Payment</p>
                                <v-row class="mt-n5" v-if="form.status_transaksi == 'Please make payment immediately and complete the data payment!'" align="center" justify="center">
                                    <v-col cols="3">
                                        <v-img class="mb-3 mt-0" width="200px" height="130px" :src="$imgloader+form.url_bukti_pembayaran"></v-img> 
                                    </v-col>
                                    <v-col>
                                        <v-text-field readonly class="formtxt" v-model="form.metode_pembayaran" label="Payment Method" ></v-text-field>  
                                        <v-text-field readonly class="formtxt" v-model="form.tgl_pengembalian" label="Return Date" ></v-text-field>
                                        <v-text-field readonly class="formtxt" v-model="form.idPromo" label="Promo" ></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field readonly class="formtxt" v-model="form.sub_total_pembayaran" label="Sub-Total Cost" ></v-text-field>
                                        <v-text-field readonly class="formtxt" v-model="form.total_potongan_promo" label="Total Discount" ></v-text-field>
                                        <v-text-field readonly class="formtxt" v-model="form.total_pembayaran" label="Net Cost" ></v-text-field>     
                                    </v-col>
                                    
                                </v-row> 
                            </v-container>  
                        </v-card-text> 
                        <v-card-actions>
                            <v-btn color="blue darken-1" text @click="dialog=false"> Close </v-btn>
                        </v-card-actions> 
                    </v-card> 
                </v-dialog>
                <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline"> Warning! </span>
                        </v-card-title>
                        <v-card-text> {{ dialogText }} </v-card-text>
                        <v-card-actions>
                            <v-text-field v-if="dialogType == 'Are you sure want to reject this request?'" class="formtxt" v-model="note_transaksi" label="Note" required ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="setDialog">Yes</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-container>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .pengenaltxt{
        font-family: Rubik;
        font-size: 12px;
    }

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
        name: "DataTransaction",
        data() { 
            return {
                load: false,
                snackbar: false,
                error_message: '',
                calendar: false,
                color: '',
                search: null, 
                dialog: false, 
                dialogConfirm: false,
                headers: [
                    {text: "ID Transaction", value: "id"},
                    {text: "Date Transaction", value: "tgl_transaksi"},
                    {text: "Type", value: "jenis_transaksi"},
                    {text: "ID Customer", value: "idCustomer"},
                    {text: "ID CS", value: "idEmployee"},
                    {text: "Status", value: "status_transaksi"},
                    {text: "", value: "actions"},
                ],
                acceptId: '',
                rejectId: '',
                returnId: '',
                showId: '',
                sts_transaksi: '',
                note_transaksi: '',
                cost: '',
                transactions: [],
                selectedCarShow: [],
                selectedDriverShow: [],
                btnShow: false,
                btnActive: false,
                btnInactive: false,
                dialogType: 'Are you sure want to accept this request?',
                return_date: '',
                form: {
                    tgl_transaksi: null,
                    jenis_transaksi: null,
                    idDriver: null,
                    idCar: null,
                    idPromo: null,
                    dailyCostCar: null,
                    dailyCostDriver: null,
                    tgl_mulai_sewa: null,
                    wkt_mulai_sewa: null,
                    tgl_selesai_sewa: null,
                    wkt_selesai_sewa: null,
                    tgl_pengembalian: null,
                    wkt_pengembalian: null,
                    url_bukti_pembayaran: null,
                    metode_pembayaran: null,
                    sub_total_pembayaran: null,
                    total_potongan_promo: null,
                    total_pembayaran: null,
                }
            };
        },

        methods: {
            setDialog(){
                if(this.dialogType == 'Are you sure want to accept this request?'){
                    this.accept();
                }else if(this.dialogType == 'Are you sure want to reject this request?'){
                    this.reject();
                }else if(this.dialogType == 'Are you sure this customer already return the car?'){
                    this.return();
                }
            },

            readData() {
                var url = this.$api + '/transaction';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transactions = response.data.data;
                })
            },

            acceptHandler(item){
                this.dialogType = 'Are you sure want to accept this request?';
                this.dialogConfirm = true;
                this.acceptId = item.id;

                if(item.status_transaksi == 'Your request is being processed! Waiting CS response'){
                    this.sts_transaksi = 'Your request has been accepted!'
                }else if(item.status_transaksi == 'Your payment is being processed! Waiting CS response'){
                    this.sts_transaksi = 'Your payment has been accepted!'
                }
            },

            accept(){
                let newData = {
                    idEmployee: localStorage.getItem('id'),
                    status_transaksi: this.sts_transaksi,
                }; 

                var url = this.$api + '/custTransaction/'+ this.acceptId 
                this.load = true; 
                this.$http.put(url, newData, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.dialogConfirm = false; 
                    this.dialogType = 'Are you sure want to accept this request?';
                    this.readData();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            rejectHandler(item){
                this.dialogType = 'Are you sure want to reject this request?';
                this.dialogConfirm = true;
                this.rejectId = item.id;

                if(item.status_transaksi == 'Your request is being processed! Waiting CS response'){
                    this.sts_transaksi = 'Your request has been rejected!'
                }else if(item.status_transaksi == 'Your payment is being processed! Waiting CS response'){
                    this.sts_transaksi = 'Your payment has been rejected!'
                }
            },

            reject(){
                let newData = {
                    idEmployee: localStorage.getItem('id'),
                    status_transaksi: this.sts_transaksi,
                    note: this.note_transaksi,
                }; 

                var url = this.$api + '/custTransaction/'+ this.rejectId 
                this.load = true; 
                this.$http.put(url, newData, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.dialogConfirm = false; 
                    this.readData();
                    this.dialogType = 'Are you sure want to accept this request?';
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });

            },

            returnHandler(item){
                //tambah fungsi update cost
                this.dialogType = 'Are you sure this customer already return the car?';
                this.dialogConfirm = true;
                this.returnId = item.id;
                this.sts_transaksi = 'Please make payment immediately and complete the data payment!'

                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); 
                var yyyy = today.getFullYear();
                var tgl_pengembalian = yyyy + '-' + mm + '-' + dd;
                var wkt_pengembalian = String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0');
                this.return_date = tgl_pengembalian + ' ' + wkt_pengembalian;

                var return_date = new Date(this.form.tgl_pengembalian);
                var selesai_sewa = new Date(this.form.tgl_selesai_sewa +' '+ this.form.wkt_selesai_sewa);
                const diffTime = Math.abs(return_date - selesai_sewa);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                const mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                if(this.form.idDriver != null && this.form.jenis_transaksi == 'Car + Driver'){
                    this.cost = (diffDays * this.selectedCarShow.tarif_harian_mobil) + (diffDays * this.selectedDriverShow.tarif_harian_driver)
                }else if(this.form.jenis_transaksi == 'Only Car'){
                    this.cost = diffDays * this.selectedCarShow.tarif_harian_mobil;
                }
            },

            return(){
                let newData = {
                    idEmployee: localStorage.getItem('id'),
                    status_transaksi: this.sts_transaksi,
                    tgl_pengembalian: this.return_date,
                    sub_total_pembayaran: this.cost,
                }; 

                var url = this.$api + '/custTransaction/'+ this.returnId 
                this.load = true; 
                this.$http.put(url, newData, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.dialogConfirm = false; 
                    this.readData();
                    this.dialogType = 'Are you sure want to accept this request?';
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            showHandler(item){
                this.dialog = true;
                this.showId = item.id;
                this.form.url_bukti_pembayaran = item.url_bukti_pembayaran;
                this.form.status_transaksi = item.status_transaksi;
                this.form.jenis_transaksi = item.jenis_transaksi;
                this.form.metode_pembayaran = item.metode_pembayaran;
                this.form.idPromo = item.idPromo;
                this.form.sub_total_pembayaran = item.sub_total_pembayaran;
                this.form.total_potongan_promo = item.total_potongan_promo;
                this.form.total_pembayaran = item.total_pembayaran;
                this.form.tgl_pengembalian = item.tgl_pengembalian;
                var mulai = new Date(item.tgl_mulai_sewa);
                var dd = String(mulai.getDate()).padStart(2, '0');
                var mm = String(mulai.getMonth() + 1).padStart(2, '0');
                var yyyy = mulai.getFullYear();
                var tgl_mulai = yyyy + '-' + mm + '-' + dd;
                var wkt_mulai = String(mulai.getHours()).padStart(2, '0') + ':' + String(mulai.getMinutes()).padStart(2, '0');
                this.form.tgl_mulai_sewa = tgl_mulai;
                this.form.wkt_mulai_sewa = wkt_mulai;

                var selesai = new Date(item.tgl_selesai_sewa);
                dd = String(selesai.getDate()).padStart(2, '0');
                mm = String(selesai.getMonth() + 1).padStart(2, '0');
                yyyy = selesai.getFullYear();
                var tgl_selesai = yyyy + '-' + mm + '-' + dd;
                var wkt_selesai = String(selesai.getHours()).padStart(2, '0') + ':' + String(selesai.getMinutes()).padStart(2, '0');
                this.form.tgl_selesai_sewa = tgl_selesai;
                this.form.wkt_selesai_sewa = wkt_selesai;

                var url = this.$api + '/showCarr/' + item.idCar;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.selectedCarShow = response.data.data;
                })
                console.log(this.selectedCarShow);

                if(item.jenis_transaksi == 'Car + Driver'){
                    url = this.$api + '/showDriver/' + item.idDriver;
                    this.$http.get(url, {
                        headers:{
                            'Authorization' : 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.selectedDriverShow = response.data.data;
                    })
                }
                console.log(this.selectedDriverShow);

            },
        },

        computed: {
            dialogText() {
                return this.dialogType;
            },
            idTransaction(){
                return this.showId;
            }
        },

        mounted() {
            this.readData();
        },
    };
</script>