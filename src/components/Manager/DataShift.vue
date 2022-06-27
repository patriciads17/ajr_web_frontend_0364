<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <!-- Form Shift -->
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" height="150px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="200px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Create Shift </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row class="ml-2">
                        <v-col class="ml-5 mt-5" cols="2">
                            <v-autocomplete  background-color="yellow" filled dense rounded class="formtxt" @change="readEmployeeName(form.role_employee)" v-model="form.role_employee" :items="role" label="Employee Role"></v-autocomplete>
                        </v-col>
                        <v-col class="ml-5 mt-5" cols="3">
                            <v-autocomplete  background-color="yellow" filled dense rounded class="formtxt" v-model="form.name_employee" :items="list" label="Employee Name"></v-autocomplete>
                        </v-col> 
                        <v-col class="ml-5 mt-5" cols="2">
                            <v-autocomplete  background-color="yellow" filled dense rounded class="formtxt" v-model="form.day_shift" :items="day" label="Day"></v-autocomplete>
                        </v-col>
                        <v-col class="ml-5 mt-5" cols="2">
                            <v-autocomplete  background-color="yellow" filled dense rounded class="formtxt" v-model="form.session_shift" :items="session" label="Session" ></v-autocomplete>
                        </v-col>
                        <v-col class="ml-5 mt-5" cols="1">
                            <v-btn :disabled="select == false" @click="saveHandler();getIdEmployee(form.name_employee);getIdShift(form.day_shift,form.session_shift)" rounded large class=" white--text" color="indigo">
                                <v-icon left color="white">mdi-content-save</v-icon>Save
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
            <!-- Shift Table -->
            <v-row class="table mt-n10" align="centre" justify="center" >
                <v-card append rounded outlined elevation="4" width="700px" max-height="400px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="230px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Shift Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-data-table height="200px" class="datacust mt-4 mx-10" :headers="headers" :items="details" :search="search">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item);getShift(item.id_shift);getEmployee(item.id_pegawai);" class="mx-2 mr-2" fab dark x-small color="indigo">
                                <v-icon dark>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn @click="editHandler(item);getShift(item.id_shift);getEmployee(item.id_pegawai)" class="mx-2 mr-2" fab dark x-small color="success">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn @click="deleteHandler(item.id)" class="mx-2 mr-2" fab dark x-small color="error">
                                <v-icon dark>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table> 
                </v-card>
                <!-- Dialog Show and Update -->
                <v-dialog v-model="dialog" persistent max-width="600px"> 
                    <v-card> 
                        <v-card-title>
                            <span class="headline">{{ formTitle }} Shift</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <v-autocomplete class="formtxt" v-model="dialogform.role_employee" label="Employee Role" @change="readEmployeeName(dialogform.role_employee)" :items="role" required :readonly="btnShow == true"></v-autocomplete>
                                <v-autocomplete class="formtxt" v-model="dialogform.name_employee" label="Employee Name" :items="list" required :readonly="btnShow == true"></v-autocomplete>
                                <v-autocomplete class="formtxt" v-model="dialogform.day_shift" label="Day Shift" :items="day" required :readonly="btnShow == true"></v-autocomplete>
                                <v-autocomplete class="formtxt" v-model="dialogform.session_shift" label="Session Shift" :items="session" required :readonly="btnShow == true"></v-autocomplete>
                            </v-container> 
                        </v-card-text> 
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="btnShow == true" color="indigo" class="font-weight-bold" text @click="unshow();resetDialogForm()"> Close </v-btn>
                            <v-btn v-if="btnShow == false" color="indigo" class="font-weight-bold" text @click="cancel();resetDialogForm()"> Cancel </v-btn>
                            <v-btn v-if="btnShow == false" color="success" class="font-weight-bold" text @click="saveUpdateHandler(); getIdShift(dialogform.day_shift,dialogform.session_shift); getIdEmployee(dialogform.name_employee)"> Save </v-btn> 
                        </v-card-actions> 
                    </v-card> 
                </v-dialog>
                <!-- Dialog Confirm -->
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

    .posisinya{
        position: absolute; 
        top: 10px; 
        left: 0; 
        right: 0;
    }

    .table{
        top: 0px; 
        left: 0; 
        right: 0;
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }

    .white--text{
        font-family: Rubik;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

</style>

<script> 
    export default {
        name: "DataShift",
        data() { 
            return {
                inputType: 'Update',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null, 
                dialog: false, 
                dialogConfirm: false,
                dialogType:'',
                headers: [
                    {text: "ID", value: "id"},
                    {text: "ID Shift", value: "id_shift"},
                    {text: "ID Employee", value: "id_pegawai"},
                    {text: "", value: "actions"},
                ],
                detail: new FormData,
                details: [],
                form: { 
                    role_employee: null,
                    name_employee: null,
                    day_shift: null,
                    session_shift: null,
                },

                dialogform: { 
                    role_employee: null,
                    name_employee: null,
                    day_shift: null,
                    session_shift: null,
                },
                deleteId: '',
                editId: '',
                btnShow: false,
                role: ['CSV','ADM'],
                day: ['Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                session: ['Session1','Session2'],
                list: [],
                id_shift: null,
                id_pegawai: null,
                employee: [],
                shift: [],
                select:true,
            };
        },


        methods: { 
            setDialog(){
                if(this.dialogType == 'Are you sure want to delete these data?'){
                    this.dialogConfirm = false;
                    this.deleteData();
                }else if(this.dialogType == 'Are you sure want to save these data shift?'){
                    this.dialogConfirm = false;
                    this.save();
                }else if(this.dialogType == 'Are you sure want to change these data shift?'){
                    this.dialogConfirm = false;
                    this.update();
                }
            },

            readEmployeeName(role){
                var url = this.$api + '/name_employee/'+ role;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.list = response.data.data;
                })
            }, 

            validationShift(id){
                var url = this.$api + '/validationShift/'+ id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.select = response.data.data;
                    console.log(this.select);
                })
            },

            getIdEmployee(name){
                var url = this.$api + '/id_employee/'+ name;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.id_pegawai = response.data.data[0];
                    this.validationShift(this.id_pegawai);
                })
            },

            getEmployee(id){
                var url = this.$api + '/get_employee/'+ id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.employee = response.data.data[0];
                    this.dialogform.name_employee = this.employee.nama_pegawai;
                    this.dialogform.role_employee = this.employee.idRole;
                    this.readEmployeeName(this.employee.idRole)
                })
            },

            getIdShift(day,session){
                var url = this.$api + '/id_shift/'+ day + '/' + session ;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.id_shift = response.data.data[0];
                })
            },

            getShift(id){
                var url = this.$api + '/get_shift/'+ id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.shift = response.data.data[0];
                    this.dialogform.day_shift = this.shift.hari_shift; 
                    this.dialogform.session_shift = this.shift.jadwal_shift; 
                })
            },

            saveHandler(){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to save these data shift?'
            },

            save(){
                this.detail.append('id_pegawai',this.id_pegawai);
                this.detail.append('id_shift',this.id_shift);
                var url = this.$api + '/detailshift' 
                this.load = true; 
                this.$http.post(url, this.detail, { 
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

            readData() {
                var url = this.$api + '/detailshift';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.details = response.data.data;
                })
            },

            showHandler() {
                this.btnShow = true;
                this.inputType = 'Show'; 
                this.dialog = true;
            },

            saveUpdateHandler(){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to change these data shift?'
            },

            update() {
                let newData = {
                    id_pegawai : this.id_pegawai,
                    id_shift : this.id_shift, 
                }; 
                console.log(this.id_pegawai);
                console.log(this.id_shift);
                var url = this.$api + '/detailshift/' + this.editId; 
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
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            deleteData() {
                var url = this.$api + '/detailshift/' + this.deleteId; 
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
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id; 
                this.dialogType = 'Are you sure want to delete these data?';
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
                    role_employee: null,
                    name_employee: null,
                    day_shift: null,
                    session_shift: null,
                };
            },

            resetDialogForm() { 
                this.dialogform = {
                    role_employee: '',
                    name_employee: '',
                    day_shift: '',
                    session_shift: '',
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
            dialogText() {
                return this.dialogType;
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>