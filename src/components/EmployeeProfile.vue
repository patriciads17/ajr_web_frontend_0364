<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-15">
            <v-row align="center" justify="center" >
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col>
                            <v-card append rounded outlined elevation="4" class="mt-6" width="250px" min-height="300px">
                                <v-row align="center" justify="center" class="mt-n5">
                                    <v-card append color="primary" align="center" rounded outlined elevation="4" width="150px" height="50px">
                                        <v-card-title class="cardTitle pa-0 my-2 justify-center"> My Shift </v-card-title>
                                    </v-card>
                                </v-row>
                                <v-row>
                                    <v-data-table class="datacust mx-10" :headers="headers" :items="shift">
                                    </v-data-table> 
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card append rounded outlined elevation="4" class="mt-6" width="500px" min-height="300px">
                                <v-row align="center" justify="center" class="mt-n5">
                                    <v-card append color="primary" align="center" rounded outlined elevation="4" width="300px" height="50px">
                                        <v-card-title class="cardTitle pa-0 my-2 justify-center"> {{cardtitle}} </v-card-title>
                                    </v-card>
                                </v-row>
                                <v-row>
                                    <v-col class="mt-3 ml-8 mr-4 mb-3" cols="3">
                                        <v-avatar size="120">
                                            <v-img v-if="btnEdit == false" :src="$imgloader+employee.url_foto_pegawai"></v-img>
                                            <v-img v-if="btnEdit == true" :src="preview_foto"></v-img>
                                        </v-avatar>
                                        <v-btn v-if="btnEdit == true" x-small @click="onPickFile" class="iconedit ml-15 mt-n8" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input v-if="btnEdit == true" type="file" style="display: none" @change="upload" ref="fileInput">
                                    </v-col>
                                    <v-col class="mt-4 mb-5">
                                        <p class="datacust ma-1"> {{ employee.id }} </p>
                                        <v-chip class="datacust mb-3" :color="getColor(employee.idRole)" outlined> 
                                            {{ getRole(employee.idRole) }} 
                                        </v-chip>
                                        <v-chip class="datacust" :color="getColorGender(employee.gender_pegawai)" outlined> 
                                            <v-icon left> {{ getIcon(employee.gender_pegawai) }} </v-icon> 
                                            {{ employee.gender_pegawai }} 
                                        </v-chip>
                                    </v-col>
                                    <v-col class="mt-5 ml-10" cols="3">
                                        <v-row>
                                            <v-btn class="my-10" v-if="btnEdit == false" @click.stop="btnEdit = !btnEdit" rounded outlined color="indigo">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                        </v-row>
                                        <v-row>
                                            <v-btn class="my-5" v-if="btnEdit == true" @click="save" rounded outlined color="success">
                                                <v-icon>mdi-check-bold</v-icon>
                                            </v-btn>
                                        </v-row>
                                        <v-row>
                                            <v-btn  v-if="btnEdit == true" @click="cancel" rounded outlined color="error">
                                                <v-icon>mdi-close-thick</v-icon>
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-divider class="mx-4 bold"></v-divider>
                                <v-row class="my-2 mx-5">                    
                                    <v-col cols="12" sm="12">
                                        <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="employee.nama_pegawai" label="Name" :readonly="btnEdit == false"></v-text-field>
                                        <v-autocomplete v-if="btnEdit == true" background-color="yellow" :items="genders" label="Gender" v-model="employee.gender_pegawai" filled dense class="pa-0 mb-0" rounded></v-autocomplete>
                                        <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="employee.alamat_pegawai" label="Address" :readonly="btnEdit == false"></v-text-field>
                                        <v-dialog ref="dialog" v-model="calendar" :return-value.sync="employee.tgl_lahir_pegawai" persistent width="290px" :disabled="btnEdit == false">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="employee.tgl_lahir_pegawai" label="Birth Date" :readonly="btnEdit == false" v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="employee.tgl_lahir_pegawai" scrollable>
                                            <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(employee.tgl_lahir_pegawai)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                        <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="employee.no_telp_pegawai" label="Phone Number" :readonly="btnEdit == false"></v-text-field>
                                        <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="employee.email" label="Email" :readonly="btnEdit == false"></v-text-field>
                                        
                                    </v-col>
                                </v-row>
                                <v-row v-if="btnEdit == true" class="mx-8 mt-n6 mb-3">
                                    <v-checkbox v-model="enabled" hide-details class="shrink" ></v-checkbox>
                                    <v-text-field v-model="newPassword" class="formtxt" dense rounded filled background-color="yellow" :disabled="!enabled" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" label="Change Password?" placeholder="New Password"></v-text-field>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
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

    .iconname{
        font-family: Rubik;
    }

    .formtxt{
        font-family: Rubik;
    }

    .pengenaltxt{
        font-family: Rubik;
        font-size: 12px;
    }

    .posisinya{
        position: absolute; 
        top: 60px; 
        left: 0; 
        right: 0;
    }

    .iconedit{ 
        top:-10px;
        left: 20px; 
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }
</style>

<script>
  export default {
    name: "EmployeeProfile",
    data () {
        return {
            valid: true,
            enabled: false,
            calendar: false,
            show: false,
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            btnEdit: false,
            genders: ['Male','Female'],
            employee: [],
            url_foto: null,
            preview_foto: require('@/assets/nopp.png'),
            updatedData: new FormData,
            newPassword: null,
            shift: [],
            headers: [
                {value: "id_shift", align:"center"},
            ],
            detailshift: [],
        }
    },

    methods: {
        readDataShift(){
            var url = this.$api + '/myShift/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.shift = response.data.data;
                console.log(this.shift);
            })
        },

        getDetailShift(){
            var url = this.$api + '/get_myshift/' + this.shift;
            this.$http.get(url, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.detailshift = response.data.data;
                console.log(this.detailshift);
            })
        },

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
        save() {
            this.updatedData.append('nama_pegawai',this.employee.nama_pegawai);
            this.updatedData.append('alamat_pegawai',this.employee.alamat_pegawai);
            this.updatedData.append('tgl_lahir_pegawai',this.employee.tgl_lahir_pegawai);
            this.updatedData.append('gender_pegawai',this.employee.gender_pegawai);
            this.updatedData.append('no_telp_pegawai',this.employee.no_telp_pegawai);
            this.updatedData.append('email',this.employee.email);
            this.updatedData.append('url_foto_pegawai',this.url_foto);

            if(!(this.newPassword == null)){
                this.updatedData.append('password',this.newPassword);
            }
            
            var url = this.$api + '/update_employee'; 
            this.load = true; 
            this.$http.post(url, this.updatedData, { 
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type' : 'multipart/form-data'
                }
            }).then(response => {
                this.error_message = response.data.message; 
                this.color = 'green'; 
                this.snackbar = true; 
                this.load = false; 
                this.readData();// baca data 
                this.btnEdit = false; 
            }).catch(error => {
                this.error_message = error.response.data.message; 
                this.color = 'red'; 
                this.snackbar = true; 
                this.load = false;
            });
            this.preview_foto = require('@/assets/nopp.png');
        },

        cancel(){
            this.readData();
            this.btnEdit = false;
            this.preview_foto = require('@/assets/nopp.png');
        },

        getColor (role) {
            if (role === 'MGR') return 'red'
            else if (role === 'ADM') return 'success'
            else if (role === 'CSV') return 'orange'
        },

        getRole (role) {
            if (role === 'MGR') return 'Manager'
            else if (role === 'ADM') return 'Administrator'
            else if (role === 'CSV') return 'Customer Service'
        },

        getColorGender (gender) {
            if (gender === 'Female') return 'pink'
            else if (gender === 'Male') return 'blue'
        },

        getIcon (gender) {
            if (gender === 'Female') return 'mdi-face-woman'
            else if (gender === 'Male') return 'mdi-face-man'
        },

        onPickFile() {
            this.$refs.fileInput.click();
        },

        upload(event) {
            let url = event.target.files[0];
            this.url_foto = url;
            this.preview_foto = URL.createObjectURL(url);
        }
    },

    mounted() {
        this.readData();
        this.readDataShift();
        this.getDetailShift();
    },

    computed: {
        cardtitle () {
            return this.btnEdit === false ? 'My Profile' : 'Edit My Profile'
        }
    }
  }
</script>