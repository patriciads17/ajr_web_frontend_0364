<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="230px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Employees Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-4 mr-5 ml-5 mb-5">
                        <v-col cols="4" class="justify-right">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                        
                        <v-btn @click="dialog = true" large class="mx-2" fab dark color="indigo">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="employees" :search="search">
                        <template v-slot:[`item.idRole`]="{ item }">
                            <v-chip class="datacust" :color="getColorRole(item.idRole)" outlined> 
                                {{ getRole(item.idRole) }} 
                            </v-chip>
                        </template> 
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
                            <span class="headline">{{ formTitle }} Employee</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <v-autocomplete v-if="inputType == 'Create' || inputType == 'Show'" class="formtxt" v-model="form.idRole" :items="roles" label="Role" :readonly="btnShow == true"></v-autocomplete>
                                <v-text-field class="formtxt" v-model="form.nama_pegawai" label="Name" required :readonly="btnShow == true"></v-text-field>
                                <v-dialog ref="dialog" v-model="calendar" :return-value.sync="form.tgl_lahir_pegawai" persistent width="290px" :disabled="btnShow == true">
                                    <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="form.tgl_lahir_pegawai" label="Birth Date" :readonly="btnShow == true" v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="form.tgl_lahir_pegawai" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_lahir_pegawai)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                                <v-text-field class="formtxt" v-model="form.no_telp_pegawai" label="Phone Number" counter required :readonly="btnShow == true"></v-text-field>
                                <v-text-field v-if="inputType == 'Create' || inputType == 'Show'" class="formtxt" v-model="form.email" label="Email" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.alamat_pegawai" label="Address" required :readonly="btnShow == true"></v-text-field>
                                <v-autocomplete class="formtxt" v-model="form.gender_pegawai" :items="genders" label="Gender" :readonly="btnShow == true"></v-autocomplete>
                            </v-container> 
                        </v-card-text> 
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="btnShow == true" color="indigo" class="font-weight-bold" text @click="unShow"> Close </v-btn>
                            <v-btn v-if="btnShow == false" color="indigo" class="font-weight-bold" text @click="cancel"> Cancel </v-btn>
                            <v-btn v-if="btnShow == false" color="success" class="font-weight-bold" text @click="dialogConfirm = true; setForm()"> Save </v-btn> 
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
                            <v-spacer></v-spacer>
                            <v-btn color="indigo" class="font-weight-bold" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="error" class="font-weight-bold" text @click="setDialog">Yes</v-btn>
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

    .tabtxt{
        font-family: Akshar;
        font-weight: bold;
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
        name: "DataEmployee",
        data() { 
            return {
                inputType: 'Create',
                load: false,
                snackbar: false,
                error_message: '',
                calendar: false,
                color: '',
                search: null, 
                dialog: false, 
                dialogConfirm: false,
                headers: [
                    {text: "ID", value: "id"},
                    {text: "Role", value: "idRole"},
                    {text: "Name", value: "nama_pegawai"},
                    {text: "Birth Date", value: "tgl_lahir_pegawai"},
                    {text: "Address", value: "alamat_pegawai"},
                    {text: "Phone Number", value: "no_telp_pegawai"},
                    {text: "", value: "actions"},
                ],
                employee: new FormData,
                employees: [],
                owners: [],
                form: { 
                    nama_pegawai: null,
                    idRole: null,
                    tgl_lahir_pegawai: null,
                    alamat_pegawai: null,
                    no_telp_pegawai: null,
                    gender_pegawai: null,
                    email: null,
                },
                deleteId: '',
                editId: '',
                roles: ['MGR','ADM','CSV'],
                genders: ['Female','Male'],
                btnShow: false,
                tabs: null,
                dialogType: 'Are you sure have filled in the correct and appropriate data?',
            };
        },


        methods: { 
            setDialog(){
                if(this.dialogType == 'Are you sure you want to delete these data?'){
                    this.dialogConfirm = false;
                    this.deleteData();
                }else if(this.dialogType == 'Are you sure you want to save these changes?'){
                    this.dialogConfirm = false;
                    this.updateData();
                }else if(this.dialogType == 'Are you sure have filled in the correct and appropriate data?'){
                    this.dialogConfirm = false;
                    this.saveData();
                }
            }, 

            setForm(){
                if(this.inputType !== 'Create'){
                    this.dialogType = 'Are you sure you want to save these changes?';
                }else{
                    this.dialogType = 'Are you sure have filled in the correct and appropriate data?';
                }
            },

            readData() {
                var url = this.$api + '/employee';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.employees = response.data.data;
                })
            },

            saveData() {
                this.employee.append('nama_pegawai', this.form.nama_pegawai); 
                this.employee.append('idRole', this.form.idRole); 
                this.employee.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai); 
                this.employee.append('alamat_pegawai', this.form.alamat_pegawai);
                this.employee.append('no_telp_pegawai', this.form.no_telp_pegawai);
                this.employee.append('email', this.form.email);
                this.employee.append('gender_pegawai', this.form.gender_pegawai);
                
                var url = this.$api + '/employee' 
                this.load = true; 
                this.$http.post(url, this.employee, { 
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
                    nama_pegawai : this.form.nama_pegawai, 
                    tgl_lahir_pegawai : this.form.tgl_lahir_pegawai,
                    alamat_pegawai : this.form.alamat_pegawai, 
                    no_telp_pegawai: this.form.no_telp_pegawai,
                    gender_pegawai: this.form.gender_pegawai
                }; 
                var url = this.$api + '/update_employees/' + this.editId; 
                this.load = true; 
                this.$http.post(url, newData, { 
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
                var url = this.$api + '/employee/' + this.deleteId; 
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
                this.dialogType = 'Are you sure you want to save these changes?'
                this.editId = item.id; 
                this.form.nama_pegawai = item.nama_pegawai; 
                this.form.idRole = item.idRole; 
                this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai; 
                this.form.alamat_pegawai = item.alamat_pegawai; 
                this.form.no_telp_pegawai = item.no_telp_pegawai; 
                this.form.gender_pegawai = item.gender_pegawai; 
                this.dialog = true;
            },

            showHandler(item) {
                this.btnShow = true;
                this.inputType = 'Show';
                this.editId = item.id; 
                this.form.nama_pegawai = item.nama_pegawai; 
                this.form.idRole = item.idRole; 
                this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai; 
                this.form.alamat_pegawai = item.alamat_pegawai; 
                this.form.no_telp_pegawai = item.no_telp_pegawai; 
                this.form.gender_pegawai = item.gender_pegawai;  
                this.form.email = item.email;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id; 
                this.dialogType = 'Are you sure you want to delete these data?'
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

            unShow(){
                this.btnShow = false;
                this.dialog = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
            },

            resetForm() { 
                this.form = {
                    nama_pegawai: null,
                    idRole: null,
                    tgl_lahir_pegawai: null,
                    alamat_pegawai: null,
                    no_telp_pegawai: null,
                    gender_pegawai: null,
                    email: null,
                };
            },
            
            getColorRole (role) {
                if (role === 'MGR') return 'indigo'
                else if (role === 'ADM') return 'success'
                else if (role === 'CSV') return 'orange'
            },

            getRole (role) {
                if (role === 'MGR') return 'Manager'
                else if (role === 'ADM') return 'Administrator'
                else if (role === 'CSV') return 'Customer Service'
            },
            // Batas Coding 1
        },

        computed: {
            formTitle() {
                return this.inputType;
            },

            dialogText() {
                return this.dialogType;
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>