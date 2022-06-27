<template>
    <main> 
        <v-container fluid fill-height class="posisinya yellow lighten-3"> 
            <v-layout flex align-center justify-center> 
                <v-flex xs12 sm4 elevation-6>    
                    <v-card elevation="2" outlined shaped> 
                        <v-card-title class="indigo--text font-weight-bold" style="font-family: Akshar; font-size: 40px; align-self: center;">
                            <v-spacer></v-spacer>
                            <v-icon @click="back_index" large color="indigo" href="" end>mdi-close-box</v-icon>
                        </v-card-title>
                        <v-card-text class="pt-4"> 
                            <p class="cardtitle indigo--text font-weight-bold ml-3">Register Driver</p>
                            <v-row>
                                <v-col cols="7">
                                    <p class="hint mt-8 ml-5" style="align-self: center;">Please prepared 
                                        <v-tooltip right>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on"> <u> following documents </u></span>
                                            </template>
                                            <span v-html="item.title" v-for="(item, index) in items" :key="index">
                                                {{ item.title }}
                                            </span>
                                            </v-tooltip>
                                            before clicking the <strong>NEXT</strong> button.</p>
                                    <v-btn @click="dialog = true" class="btntext mt-5 ml-5" color="error"> NEXT
                                        <v-icon dark>mdi-arrow-right-bold-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col >
                                    <v-img class="justify-center" :src="require('@/assets/ajr_regis_driver.png')" max-width="150px" max-height="150px"></v-img>
                                </v-col>
                            </v-row>
                        </v-card-text> 
                    </v-card>
                    <v-dialog v-model="dialog" persistent max-width="750px">
                        <v-card>
                        <v-card-title>
                            <span class="cardtitle">Register Driver</span> 
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <p class="cardsubtitle indigo--text font-weight-bold ">1 - Personal Data</p>
                                <v-row>
                                    <v-col cols="3">
                                        <v-avatar size="180" style="margin-top: 30px; margin-left: -20px">
                                            <v-img v-if="preview_pp == null" :src="require('@/assets/nopp.png')"></v-img>
                                            <v-img v-if="preview_pp != null" :src="preview_pp"></v-img>
                                        </v-avatar>
                                        <v-btn small @click="onPickFile_pp" class="btntext" style="margin-left: 110px; margin-top: -80px;" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_pp" ref="fileInput_pp"> 
                                    </v-col>
                                    <v-col>
                                        <v-text-field class="labeltxt" clearable label="Name" v-model="form.nama_driver" :rules="fieldRules" required prepend-inner-icon="mdi-account-outline" hint="Using name that written on your ID card"></v-text-field> 
                                        <v-dialog ref="dialog" v-model="calendar" :return-value.sync="form.tgl_lahir" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field class="labeltxt" clearable v-model="form.tgl_lahir" label="Birth Date" prepend-inner-icon="mdi-calendar"  :rules="fieldRules" readonly v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_lahir" scrollable>
                                                <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_lahir)">OK</v-btn>
                                                </v-date-picker>
                                        </v-dialog>
                                        <v-autocomplete class="labeltxt" v-model="form.gender" :items="genders" :rules="fieldRules" label="Gender" prepend-inner-icon="mdi-gender-male-female"></v-autocomplete>
                                        <v-text-field class="labeltxt" clearable label="Address" v-model="form.alamat" :rules="fieldRules" prepend-inner-icon="mdi-home" required></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field class="labeltxt" clearable label="E-mail" v-model="form.email" min="8" :rules="fieldRules" prepend-inner-icon="mdi-email-outline" required></v-text-field>
                                        <v-text-field class="labeltxt" clearable label="Phone Number" counter v-model="form.phonenum" min="12" :rules="fieldRules" prepend-inner-icon="mdi-cellphone" required></v-text-field>
                                        <v-autocomplete class="labeltxt" v-model="form.bahasa" :items="languages" label="Language" :rules="fieldRules" prepend-inner-icon="mdi-translate" multiple></v-autocomplete>
                                        <v-text-field class="labeltxt" clearable label="Daily Cost" v-model="form.tarif" :rules="fieldRules" prefix="Rp" prepend-inner-icon="mdi-cash" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="error" text @click="dialogConfirm = true; dialogType = 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'"> Cancel </v-btn> 
                            <v-btn class="font-weight-bold" color="success" text @click="dialog2 = true"> Next </v-btn> 
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialog2" persistent max-width="600px">
                        <v-card>
                            <v-card-title>
                                <span class="cardtitle">Register Driver</span> 
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <p class="cardsubtitle indigo--text font-weight-bold mb-8">2 - Requirement Documents</p>
                                    <v-row>
                                        <v-col cols="6">
                                            <p class="cardtext black--text">Driver License</p>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn small @click="onPickFile_sim" class="btntext" color="error">
                                                <v-icon dark>mdi-image-edit</v-icon>
                                            </v-btn>
                                            <input type="file" style="display: none" @change="upload_sim" ref="fileInput_sim">
                                        </v-col>
                                        <v-col >
                                            <v-btn v-if="preview_sim != null" @click="fileHandler(preview_sim)" class="btntext ml-2" small color="yellow">
                                                <v-icon color="indigo">mdi-file-document</v-icon>File
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                <v-row>
                                    <v-col cols="6">
                                         <p class="cardtext black--text center--text">Drug-Free Certificate</p>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn small @click="onPickFile_napza" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_napza" ref="fileInput_napza">
                                    </v-col>
                                    <v-col>
                                        <v-btn v-if="preview_napza != null" @click="fileHandler(preview_napza)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <p class="cardtext black--text">Mental Health Certificate</p>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn small @click="onPickFile_jiwa" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_jiwa" ref="fileInput_jiwa">
                                    </v-col>
                                    <v-col>
                                        <v-btn v-if="preview_jiwa != null" @click="fileHandler(preview_jiwa)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6"> 
                                        <p class="cardtext black--text">Physics Health Certificate</p>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn small @click="onPickFile_fisik" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_fisik" ref="fileInput_fisik">
                                    </v-col>
                                    <v-col>
                                        <v-btn v-if="preview_fisik != null" @click="fileHandler(preview_fisik)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <p class="cardtext black--text">Statement of Good Conduct</p>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn small @click="onPickFile_skck" class="btntext" color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_skck" ref="fileInput_skck">
                                    </v-col>
                                    <v-col>
                                        <v-btn v-if="preview_skck != null" @click="fileHandler(preview_skck)" class="btntext ml-2" small color="yellow">
                                            <v-icon color="indigo">mdi-file-document</v-icon>File
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="indigo" text @click="dialog2 = false"> Back </v-btn>
                            <v-btn class="font-weight-bold" color="error" text @click="dialogConfirm = true; dialogType = 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'"> Cancel </v-btn> 
                            <v-btn class="font-weight-bold" color="success" text @click="dialogConfirm = true; dialogType = 'Are you sure have filled in the correct and appropriate data?'"> Register </v-btn> 
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
                            <v-btn class="font-weight-bold" color="error" text @click="dialogImage = false"> Close </v-btn> 
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
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
                    <V-snackbar v-model="snackbar" style="font-family: Rubik" :color="color" timeout="2000" top>{{ error_message }}</v-snackbar> 
                </v-flex> 
            </v-layout> 
        </v-container> 
    </main>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .labeltxt{
        font-family: Rubik;
    }

    .cardtitle{
        font-family: Rubik;
        font-size: 30px;
    }

    .hint{
        font-family: Rubik;
        font-size: 15px;
    }

    .iconedit2{ 
        top:-10px;
        left: 300px; 
    }

    .btntext{
        font-family: Rubik;
        font-weight: bold;
    }
    .posisinya{
        position: absolute; 
        top: 0px; 
        left: 0; 
        right: 0;
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
        name: "RegisterDriver",
        data() { 
            return {
                load: false,
                snackbar: false,
                error_message: '',
                calendar: false,
                color: '',
                dialog: false, 
                dialog2: false,
                dialogImage: false,
                dialogConfirm: false,
                items: [
                    { title: '<li>Driver License</li>' },
                    { title: '<li>Drug-Free Certificate</li>' },
                    { title: '<li>Mental Health Certificate</li>' },
                    { title: '<li>Physics Health Certificate</li>' },
                    { title: '<li>Statement of Good Conduct</li>' },
                ],
                driver: new FormData,
                drivers: [],
                form: { 
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
                genders: ['Female','Male'],
                languages: ['Indonesia', 'Inggris', 'Jepang', 'Korea', 'Mandarin', 'Melayu', 'Spanyol', 'Thailand', ],
                btnShow: false,
                btnEdit_pp : false,
                btnEdit_sim : false,
                btnEdit_skck : false,
                btnEdit_napza : false,
                btnEdit_jiwa : false,
                btnEdit_fisik : false,
                field: '', 
                fieldRules: [(v) => !!v || 'Cannot Be Empty!',],
                preview_pp: null,
                preview_sim: null,
                preview_skck: null,
                preview_napza: null,
                preview_jiwa: null,
                preview_fisik: null,
                imgUrl:null,
                dialogType: null,
            };
        },
        
        methods: { 
            setDialog(){
                if(this.dialogType == 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'){
                    this.dialog = false;
                    this.dialog2 = false;
                    this.dialogConfirm = false;
                    this.clear();
                }else if(this.dialogType == 'Are you sure have filled in the correct and appropriate data?'){
                    this.regis();
                    this.dialogConfirm = false;
                }
            },
            
            regis() {
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
                    this.load = true; 
                    this.$http.post(this.$api + '/regisDriver', this.driver,{
                    }).then(response => {
                        this.error_message = response.data.message; 
                        this.color = "green"; 
                        this.snackbar = true; 
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

            clear() {
                this.form = { 
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
                }
            },

            fileHandler(url){
                this.imgUrl = url;
                this.dialogImage = true;
            },

            close_form() {
                this.$router.push({
                    name: 'RegisterDriver', 
                }); 
            },

            back_index() {
                this.$router.push({
                    name: 'IndexPage', 
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
            
        },
    };
</script>