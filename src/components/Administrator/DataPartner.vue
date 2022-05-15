<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="200px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Partners Table </v-card-title>
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
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="partners" :search="search">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
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
                            <span class="headline">{{ formTitle }} Partner</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <v-text-field class="formtxt" v-model="form.nama_mitra" label="Name" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.no_ktp_mitra" label="ID Card Number" counter required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.no_telp_mitra" label="Phone Number" type="numeric" required counter :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.alamat_mitra" label="Address" required :readonly="btnShow == true"></v-text-field>
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
                        <v-card-text> Are you sure want to delete this partner? </v-card-text>
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

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
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
                    {text: "Name", value: "nama_mitra"},
                    {text: "Address", value: "alamat_mitra"},
                    {text: "Phone Number", value: "no_telp_mitra"},
                    {text: "", value: "actions"},
                ],
                partner: new FormData,
                partners: [],
                form: { 
                    nama_mitra: null,
                    alamat_mitra: null,
                    no_telp_mitra: null,
                    no_ktp_mitra: null,
                },
                deleteId: '',
                editId: '',
                btnShow: false,
            };
        },

        methods: { 
            setForm(){
                if(this.inputType !== 'Create'){
                    this.updateData();
                }else{
                    this.saveData();
                }
            },

            readData() {
                var url = this.$api + '/partner';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.partners = response.data.data;
                })
            },

            saveData() {
                this.partner.append('nama_mitra', this.form.nama_mitra); 
                this.partner.append('no_ktp_mitra', this.form.no_ktp_mitra); 
                this.partner.append('no_telp_mitra', this.form.no_telp_mitra); 
                this.partner.append('alamat_mitra', this.form.alamat_mitra);

                var url = this.$api + '/partner' 
                this.load = true; 
                this.$http.post(url, this.partner, { 
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

            updateData() { 
                let newData = {
                    nama_mitra : this.form.nama_mitra, 
                    no_ktp_mitra : this.form.no_ktp_mitra, 
                    no_telp_mitra : this.form.no_telp_mitra,
                    alamat_mitra : this.form.alamat_mitra 
                }; 
                var url = this.$api + '/partner/' + this.editId; 
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
                var url = this.$api + '/partner/' + this.deleteId; 
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
                this.form.nama_mitra = item.nama_mitra; 
                this.form.no_ktp_mitra = item.no_ktp_mitra; 
                this.form.no_telp_mitra = item.no_telp_mitra; 
                this.form.alamat_mitra = item.alamat_mitra; 
                this.dialog = true;
            },

            showHandler(item) {
                this.btnShow = true;
                this.inputType = 'Show'; 
                this.editId = item.id; 
                this.form.nama_mitra = item.nama_mitra; 
                this.form.no_ktp_mitra = item.no_ktp_mitra; 
                this.form.no_telp_mitra = item.no_telp_mitra; 
                this.form.alamat_mitra = item.alamat_mitra; 
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
                    nama_mitra: null,
                    alamat_mitra: null,
                    no_telp_mitra: null,
                    no_ktp_mitra: null,
                };
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