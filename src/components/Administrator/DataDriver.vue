<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo"  rounded outlined elevation="4" width="230px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Drivers Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="mx-4 mt-6"></v-divider>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="drivers" :search="search">
                        <template v-slot:[`item.status_akun`]="{ item }">
                            <v-chip class="datacust" :color="getColorSts(item.status_akun)" outlined> 
                                {{ getTextSts(item.status_akun) }} 
                            </v-chip>
                        </template> 
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
                                <v-icon dark>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_akun == 'Inactive'" @click="activeHandler(item)" class="mx-2 mr-2" fab dark x-small color="success">
                                <v-icon dark>mdi-check-bold</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_akun == 'Active'" @click="inactiveHandler(item)" class="mx-2 mr-2" fab dark x-small color="error">
                                <v-icon dark>mdi-close-thick</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table> 
                </v-card>
                <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline"> Warning! </span>
                        </v-card-title>
                        <v-card-text class="dialogtext" v-html="dialogText"> {{ dialogText }}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="indigo" class="font-weight-bold" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="error" class="font-weight-bold" text @click="setDialog">Yes</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogImage" persistent max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Preview File</span>
                        </v-card-title>
                        <v-img :src="imgUrl" aspect-ratio="0.9" contain class="mx-5"></v-img>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="indigo" text @click="dialogImage = false"> Close </v-btn> 
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Data Driver</span> 
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <p class="cardsubtitle indigo--text">Personal Data</p>
                                <v-row>
                                    <v-col>
                                        <v-text-field class="labeltxt" label="Name" v-model="form.nama_driver" :readonly="edited == false"></v-text-field> 
                                        <v-text-field class="labeltxt" label="Birth Date" v-model="form.tgl_lahir" :readonly="edited == false" ></v-text-field>
                                        <v-text-field class="labeltxt" label="Gender" v-model="form.gender" :readonly="edited == false"  ></v-text-field>
                                        <v-text-field class="labeltxt" label="Address" v-model="form.alamat" :readonly="edited == false" ></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field class="labeltxt" label="Email" v-model="form.email" :readonly="edited == false" ></v-text-field> 
                                        <v-text-field class="labeltxt" label="Phone Number" v-model="form.phonenum" :readonly="edited == false"  ></v-text-field>
                                        <v-text-field class="labeltxt" label="Language" v-model="form.bahasa" :readonly="edited == false" ></v-text-field>
                                        <v-text-field class="labeltxt" label="Daily Cost" prefix="Rp" v-model="form.tarif" :readonly="edited == false" ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="edited == false" class="font-weight-bold" color="error" text @click="editHandler"> Edit </v-btn> 
                            <v-btn v-if="edited == true" class="font-weight-bold" color="indigo" text @click="cancelHandler"> Cancel </v-btn>
                            <v-btn v-if="edited == false" class="font-weight-bold" color="indigo" text @click="dialog = false"> Close </v-btn> 
                            <v-btn class="font-weight-bold" color="success" text @click="dialog2 = true"> Next </v-btn> 
                        </v-card-actions> 
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialog2" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Data Driver</span> 
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <p class="cardsubtitle indigo--text">Requirement Documents</p>
                                <v-row>
                                    <v-col cols="6">
                                        <p class="cardtext black--text">Driver License</p>
                                    </v-col>
                                    <v-col cols="2" v-if="edited == true">
                                        <v-btn small @click="onPickFile_sim" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_sim" ref="fileInput_sim">
                                    </v-col>
                                    <v-col >
                                        <v-btn @click="simFileHandler(form.url_sim)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                         <p class="cardtext black--text center--text">Drug-Free Certificate</p>
                                    </v-col>
                                    <v-col cols="2" v-if="edited == true">
                                        <v-btn small @click="onPickFile_napza" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_napza" ref="fileInput_napza">
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="napzaFileHandler(form.url_napza)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <p class="cardtext black--text">Mental Health Certificate</p>
                                    </v-col>
                                    <v-col cols="2" v-if="edited == true">
                                        <v-btn small @click="onPickFile_jiwa" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_jiwa" ref="fileInput_jiwa">
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="jiwaFileHandler(form.url_jiwa)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6"> 
                                        <p class="cardtext black--text">Physics Health Certificate</p>
                                    </v-col>
                                    <v-col cols="2" v-if="edited == true">
                                        <v-btn small @click="onPickFile_fisik" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_fisik" ref="fileInput_fisik">
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="fisikFileHandler(form.url_fisik)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <p class="cardtext black--text">Statement of Good Conduct</p>
                                    </v-col>
                                    <v-col cols="2" v-if="edited == true">
                                        <v-btn small @click="onPickFile_skck" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_skck" ref="fileInput_skck">
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="skckFileHandler(form.url_skck)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="edited == true" class="font-weight-bold" color="indigo" text @click="cancelHandler"> Cancel </v-btn>
                            <v-btn v-if="edited == true" class="font-weight-bold" color="success" text @click="saveHandler"> Save </v-btn>
                            <v-btn v-if="edited == false" class="font-weight-bold" color="indigo" text @click="dialog2 = false"> Close </v-btn>
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

    .cardsubtitle{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

    .cardtext{
        font-family: Rubik;
        font-size: 15px;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

    .dialogtext{
        font-family: Rubik;
        color: black;
    }

    .btntext{
        font-family: Rubik;
        font-weight: bold;
    }
</style>

<script> 
    export default {
        name: "DataDriver",
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
                dialog2: false,
                dialogImage: false,
                dialogConfirm: false,
                headers: [
                    {text: "ID", value: "id"},
                    {text: "Name", value: "nama_driver"},
                    {text: "Birth Date", value: "tgl_lahir_driver"},
                    {text: "Gender", value: "gender_driver"},
                    {text: "Availability", value: "status_ketersediaan_driver"},
                    {text: "Account Status ", value: "status_akun"},
                    {text: "", value: "actions"},
                ],
                form: { 
                    id: null,
                    nama_driver: null,
                    tgl_lahir: null,
                    phonenum: null,
                    alamat: null,
                    bahasa: null,
                    gender: null,
                    tarif: null,
                    email: null,
                    url_pp: null,
                    url_sim: null,
                    url_skck: null,
                    url_napza:null,
                    url_jiwa: null,
                    url_fisik: null,
                },
                driver: new FormData,
                drivers: [],
                editId: '',
                genders: ['Female','Male'],
                btnShow: false,
                dialogType: null,
                sts_akun: null,
                imgUrl:null,
                edited: false,
                preview_pp: null,
                preview_sim: null,
                preview_skck: null,
                preview_napza: null,
                preview_jiwa: null,
                preview_fisik: null,
                btnEdit_pp : false,
                btnEdit_sim : false,
                btnEdit_skck : false,
                btnEdit_napza : false,
                btnEdit_jiwa : false,
                btnEdit_fisik : false,
            };
        },


        methods: { 
            setDialog(){
                if(this.dialogType == 'Are you sure want to <strong>activate</strong> this account?'){
                    this.sts_akun = 'Active';
                    this.updateStatusAccount();
                }else if(this.dialogType == 'Are you sure want to <strong>inactivate</strong> this account?'){
                    this.sts_akun = 'Inactive';
                    this.updateStatusAccount();
                }else if(this.dialogType == 'Are you sure want to <strong>cancel</strong> this editing?'){
                   this.dialog = false;
                   this.dialog2 = false;
                   this.dialogConfirm = false;
                   this.edited = false;
                }else if(this.dialogType == 'Are you sure want to <strong>edit</strong> this account?'){
                   this.dialogConfirm = false;
                   this.saveData();
                }
            },

            readDataDriver(){
                var url = this.$api + '/driver';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            getColorSts(sts){
                if(sts == 'Inactive') return 'error'
                else return 'success'
            },

            getTextSts(sts){
                if(sts == 'Inactive') return 'Inactive'
                else return 'Active'
            },

            editHandler(){
                this.edited = true;
            },

            saveHandler(){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to <strong>edit</strong> this account?';
            },

            saveData(){
                this.driver.append('id', this.form.id);
                this.driver.append('nama_driver', this.form.nama_driver); 
                this.driver.append('alamat_driver', this.form.alamat); 
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir);
                this.driver.append('gender_driver', this.form.gender);
                this.driver.append('email', this.form.email);
                this.driver.append('no_telp_driver', this.form.phonenum);
                this.driver.append('kemampuan_bahasa', this.form.bahasa);
                this.driver.append('tarif_harian_driver', this.form.tarif);
                this.driver.append('url_foto_driver', this.form.url_pp);
                this.driver.append('url_sim_driver', this.form.url_sim);
                this.driver.append('url_bebas_napza', this.form.url_napza);
                this.driver.append('url_sehat_jiwa', this.form.url_jiwa);
                this.driver.append('url_sehat_fisik', this.form.url_fisik);
                this.driver.append('url_skck', this.form.url_skck);

                var url = this.$api + '/dataDriver'; 
                this.load = true; 
                this.$http.post(url, this.driver, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : 'multipart/form-data'
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.edited = false;
                    this.load = false; 
                    this.dialog =false;
                    this.dialog2 = false;
                    this.clear(); 
                    this.close_form();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;  
                    this.load = false;
                })
            },

            cancelHandler(){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to <strong>cancel</strong> this editing?';
            },

            showHandler(item){
                this.dialog = true;
                this.form.id = item.id;
                this.form.nama_driver = item.nama_driver;
                this.form.tgl_lahir = item.tgl_lahir_driver;
                this.form.alamat = item.alamat_driver;
                this.form.gender = item.gender_driver;
                this.form.email = item.email;
                this.form.phonenum = item.no_telp_driver;
                this.form.tarif = item.tarif_harian_driver;
                this.form.bahasa = item.kemampuan_bahasa;
                this.form.url_pp = item.url_foto_driver;
                this.form.url_sim = item.url_sim_driver;
                this.form.url_skck = item. url_skck;
                this.form.url_napza = item.url_bebas_napza;
                this.form.url_jiwa = item.url_sehat_jiwa;
                this.form.url_fisik = item.url_sehat_fisik;
            },

            napzaFileHandler(url){
                if(this.preview_napza == null){
                     this.imgUrl = this.$imgloader+url;
                }else{
                    this.imgUrl = this.preview_napza
                }
                this.dialogImage = true;
            },

            simFileHandler(url){
                if(this.preview_sim == null){
                     this.imgUrl = this.$imgloader+url;
                }else{
                    this.imgUrl = this.preview_sim
                }
                this.dialogImage = true;
            },

            skckFileHandler(url){
                 if(this.preview_skck == null){
                     this.imgUrl = this.$imgloader+url;
                }else{
                    this.imgUrl = this.preview_skck
                }
                this.dialogImage = true;
            },

            jiwaFileHandler(url){
                 if(this.preview_jiwa == null){
                     this.imgUrl = this.$imgloader+url;
                }else{
                    this.imgUrl = this.preview_jiwa
                }
                this.dialogImage = true;
            },

            fisikFileHandler(url){
                 if(this.preview_fisik == null){
                     this.imgUrl = this.$imgloader+url;
                }else{
                    this.imgUrl = this.preview_fisik
                }
                this.dialogImage = true;
            },

            activeHandler(item){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to <strong>activate</strong> this account?';
                this.editId = item.id;
            },

            inactiveHandler(item){
                this.dialogConfirm = true;
                this.dialogType = 'Are you sure want to <strong>inactivate</strong> this account?';
                this.editId = item.id;
            },

            updateStatusAccount(){
                let newData = {
                    status_akun: this.sts_akun,
                }; 
                var url = this.$api + '/driver/'+ this.editId; 
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
                    this.readDataDriver(); 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            onPickFile_pp() {
                this.btnEdit_pp = true;
                this.$refs.fileInput_pp.click();
            },

            upload_pp(event) {
                let url = event.target.files[0];
                this.form.url_pp = url;
                this.preview_pp = URL.createObjectURL(url);
            },

            onPickFile_sim() {
                this.btnEdit_sim = true;
                this.$refs.fileInput_sim.click();
            },

            upload_sim(event) {
                let url = event.target.files[0];
                this.form.url_sim = url;
                this.preview_sim = URL.createObjectURL(url);
            },

            onPickFile_skck() {
                this.btnEdit_skck = true;
                this.$refs.fileInput_skck.click();
            },

            upload_skck(event) {
                let url = event.target.files[0];
                this.form.url_skck = url;
                this.preview_skck = URL.createObjectURL(url);
            },

            onPickFile_napza() {
                this.btnEdit_napza = true;
                this.$refs.fileInput_napza.click();
            },

            upload_napza(event) {
                let url = event.target.files[0];
                this.form.url_napza = url;
                this.preview_napza = URL.createObjectURL(url);
            },

            onPickFile_jiwa() {
                this.btnEdit_jiwa = true;
                this.$refs.fileInput_jiwa.click();
            },

            upload_jiwa(event) {
                let url = event.target.files[0];
                this.form.url_jiwa = url;
                this.preview_jiwa = URL.createObjectURL(url);
            },

            onPickFile_fisik() {
                this.btnEdit_fisik = true;
                this.$refs.fileInput_fisik.click();
            },

            upload_fisik(event) {
                let url = event.target.files[0];
                this.form.url_fisik = url;
                this.preview_fisik = URL.createObjectURL(url);
            },
        },

        computed: {
            dialogText() {
                return this.dialogType;
            },
        },

        mounted() {
            this.readDataDriver();
        },
    };
</script>