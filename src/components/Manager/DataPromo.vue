<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="200px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Promos Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                        
                        <v-btn @click="dialog = true" large class="mx-2" fab dark color="indigo">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>
                    <v-divider class="mx-4 mt-6"></v-divider>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="promos" :search="search">
                        <template v-slot:[`item.status_promo`] ="{ item }">
                            <v-chip class="datacust" :color="getColorStatus(item.status_promo)" outlined> 
                                {{ item.status_promo }} 
                            </v-chip>
                        </template> 
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item)" @change="show(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
                                <v-icon dark>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn @click="editHandler(item)" class="mx-2 mr-2" fab dark x-small color="success">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn @click="deleteHandler(item.id)" class="mx-2 mr-2" fab dark x-small color="error">
                                <v-icon dark>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table> 
                </v-card>
                <v-dialog v-model="dialog" persistent max-width="600px"> 
                    <v-card> 
                        <v-card-title>
                            <span class="headline">{{ formTitle }} Promo</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <v-text-field class="formtxt" v-model="form.kode_promo" label="Promo Code" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.syarat_promo" label="Promo Requirement" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.jenis_promo" label="Promo Type" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.besar_potongan" type="number" append-icon="mdi-percent" label="Discount" required :readonly="btnShow == true"></v-text-field>
                                <v-autocomplete class="formtxt" v-model="form.status_promo" :items="status_promo" label="Status" :readonly="btnShow == true"></v-autocomplete>
                            </v-container> 
                        </v-card-text> 
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="btnShow == true" color="blue darken-1" text @click="unshow"> Close </v-btn>
                            <v-btn v-if="btnShow == false" color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                            <v-btn v-if="btnShow == false" color="blue darken-1" text @click="setForm"> Save </v-btn> 
                        </v-card-actions> 
                    </v-card> 
                </v-dialog>
                <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline"> Warning! </span>
                        </v-card-title>
                        <v-card-text> Are you sure want to delete this promo? </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
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
        name: "DataPromo",
        data() { 
            return {
                inputType: 'Create',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null, 
                dialog: false, 
                dialogConfirm: false,
                headers: [
                    {text: "ID", value: "id"},
                    {text: "Promo Code", value: "kode_promo", align: "start", sortable: true},
                    {text: "Requirement", value: "syarat_promo"},
                    {text: "Promo Type", value: "jenis_promo"},
                    {text: "Discount", value: "besar_potongan"},
                    {text: "Status", value: "status_promo"},
                    {text: "", value: "actions"},
                ],
                promo: new FormData,
                promos: [],
                form: { 
                    kode_promo: null,
                    syarat_promo: null,
                    jenis_promo: null,
                    status_promo: null,
                    besar_potongan: null,
                },
                deleteId: '',
                editId: '',
                status_promo: ['Available','Unavailable'],
                btnShow: false,
            };
        },


        methods: { 
            setForm(){
                if(this.inputType !== 'Create'){
                    this.update();
                }else{
                    this.save();
                }
            },

            readData() {
                var url = this.$api + '/promo';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promos = response.data.data;
                })
            },

            save() {
                this.promo.append('kode_promo', this.form.kode_promo); 
                this.promo.append('syarat_promo', this.form.syarat_promo); 
                this.promo.append('jenis_promo', this.form.jenis_promo); 
                this.promo.append('status_promo', this.form.status_promo);
                this.promo.append('besar_potongan', this.form.besar_potongan);

                var url = this.$api + '/promo' 
                this.load = true; 
                this.$http.post(url, this.promo, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.load = true; 
                    this.close(); 
                    this.readData(); // baca data
                    this.resetForm(); 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            update() { 
                let newData = {
                    kode_promo : this.form.kode_promo, 
                    syarat_promo : this.form.syarat_promo, 
                    jenis_promo : this.form.jenis_promo,
                    status_promo : this.form.status_promo,
                    besar_potongan: this.form.besar_potongan
                }; 
                var url = this.$api + '/promo/' + this.editId; 
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
                    this.close(); 
                    this.readData(); // baca data 
                    this.resetForm();
                    this.inputType = 'Create'; 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            deleteData() {
                var url = this.$api + '/promo/' + this.deleteId; 
                this.load = true; 
                this.$http.delete(url, { 
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.close(); 
                    this.readData();
                    this.resetForm();
                    this.inputType = "Create"; 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            editHandler(item) {
                this.inputType = 'Update'; 
                this.editId = item.id; 
                this.form.kode_promo = item.kode_promo; 
                this.form.syarat_promo = item.syarat_promo; 
                this.form.jenis_promo = item.jenis_promo; 
                this.form.status_promo = item.status_promo; 
                this.form.besar_potongan = item.besar_potongan; 
                this.dialog = true;
            },

            showHandler(item) {
                this.btnShow = true;
                this.inputType = 'Show'; 
                this.editId = item.id; 
                this.form.kode_promo = item.kode_promo; 
                this.form.syarat_promo = item.syarat_promo; 
                this.form.jenis_promo = item.jenis_promo; 
                this.form.status_promo = item.status_promo; 
                this.form.besar_potongan = item.besar_potongan; 
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id; 
                this.dialogConfirm = true;
            },

            close() {
                this.dialog = false; 
                this.inputType = 'Create'; 
                this.dialogConfirm = false; 
                this.readData();
            },

            cancel() {
                this.resetForm(); 
                this.readData(); 
                this.dialog = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
            },

            unshow(){
                this.btnShow = false;
                this.dialog = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
            },

            resetForm() { 
                this.form = {
                    kode_promo: null,
                    syarat_promo: null,
                    jenis_promo: null,
                    status_promo: null,
                    besar_potongan: null,
                };
            },
            
            getColorStatus (status) {
            if (status === 'Available') return 'success'
            else if (status === 'Unavailable') return 'error'
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>