<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" rounded outlined elevation="4" width="150px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Cars Table </v-card-title>
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
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="cars" :search="search">
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
                        <template v-slot:[`item.status_kontrak`]="{ item }">
                            <v-chip class="datacust" :color="getdeadlineColor(item.status_kontrak)" v-if="item.kategori_aset == 'Partner'" outlined> 
                                {{ getdeadlineText(item.status_kontrak) }} 
                            </v-chip>
                        </template>
                    </v-data-table> 
                </v-card>
                <v-dialog v-model="dialog" persistent width="800px"> 
                    <v-card> 
                        <v-card-title>
                            <span class="headline">{{ formTitle }} Car</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container> 
                                <v-row>
                                    <v-col class="mt-7 ml-8 mr-4" cols="3">
                                        <v-avatar class="avatar" size="120">
                                            <v-img v-if="inputType == 'Show'" :src="$imgloader+form.url_car_img"></v-img>
                                            <v-img v-if="inputType == 'Create' || inputType == 'Update'" :src="preview_car"></v-img>
                                        </v-avatar>
                                        <v-btn v-if="inputType == 'Create' || inputType == 'Update'" x-small @click="onPickFile" class="iconedit ml-15 mt-n8" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input  v-if="inputType == 'Create' || inputType == 'Update'" type="file" style="display: none" @change="uploadImg" ref="fileInput">
                                    </v-col>
                                    <v-col class="ml-8 mr-4" >
                                        <v-text-field class="formtxt" v-model="form.no_plat" label="Plat Number" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.nama_mobil" label="Name" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.tipe_mobil" label="Type" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.no_stnk" counter label="Vehicle Registration Number" required :readonly="btnShow == true"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-3">
                                    <v-col class="mb-3" cols="6">
                                        <v-text-field class="formtxt" v-model="form.jenis_transmisi" label="Transmision" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.jenis_bahan_bakar" label="Fuel" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.warna_mobil" label="Color" required :readonly="btnShow == true"></v-text-field>
                                    </v-col>
                                    <v-col class="mb-3" cols="6">
                                        <v-text-field class="formtxt" v-model="form.kapasitas_penumpang" label="Passenger Capacity" type="numeric" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.fasilitas_mobil" label="Facility" required :readonly="btnShow == true"></v-text-field>
                                        <v-text-field class="formtxt" v-model="form.vol_bagasi" hide-details label="Baggage Capacity" required :readonly="btnShow == true"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="mb-3" cols="6">
                                        <v-dialog ref="dialog" v-model="calendar" :return-value.sync="form.tgl_terakhir_service" persistent width="290px" :disabled="btnShow == true">
                                            <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="formtxt" v-model="form.tgl_terakhir_service" label="Last Service" :readonly="btnShow == true" v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_terakhir_service" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_terakhir_service)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                        <v-text-field class="formtxt" v-model="form.tarif_harian_mobil" label="Daily Rent Costs" required :readonly="btnShow == true"></v-text-field>
                                        <v-autocomplete class="formtxt" v-model="form.kategori_aset" :items="proprietor" label="Proprietor" :readonly="btnShow == true"></v-autocomplete>
                                        <v-autocomplete class="formtxt" v-model="form.ketersediaan_mobil" :items="availability" v-if="inputType == 'Update'" label="Availability" :readonly="btnShow == true"></v-autocomplete>
                                    </v-col>
                                    <v-col v-if="form.kategori_aset == 'Partner'" class="mb-3" cols="6">
                                        <v-text-field class="formtxt" v-bind="getIdMitra(form.nama_mitra)" v-model="form.nama_mitra" label="Partner Name" required :readonly="btnShow == true"></v-text-field>
                                        <v-dialog ref="dialog1" v-model="calendar1" :return-value.sync="form.tgl_mulai_kontrak" persistent width="290px" :disabled="btnShow == true">
                                            <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="formtxt" v-model="form.tgl_mulai_kontrak" label="Start Contract" :readonly="btnShow == true" v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_mulai_kontrak" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="calendar1 = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog1.save(form.tgl_mulai_kontrak)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                        <v-dialog ref="dialog2" v-model="calendar2" :return-value.sync="form.tgl_selesai_kontrak" persistent width="290px" :disabled="btnShow == true">
                                            <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="formtxt" v-model="form.tgl_selesai_kontrak" label="End Contract" :readonly="btnShow == true" v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_selesai_kontrak" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="calendar2 = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog2.save(form.tgl_selesai_kontrak)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                        <v-text-field class="formtxt" v-model="form.status_kontrak" label="Status Contract" required v-if="inputType == 'Update'" :readonly="btnShow == true"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container> 
                        </v-card-text> 
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="btnShow == true" color="indigo" class="font-weight-bold" text @click="unshow"> Close </v-btn>
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
                        <v-card-text> {{dialogText}} </v-card-text>
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

    .iconedit{ 
        top:30px;
        left: 40px; 
    }

    .avatar{ 
        top:30px;
        left: 20px; 
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
        name: "DataCar",
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
                    {text: "Plat Number", value: "no_plat"},
                    {text: "Name", value: "nama_mobil"},
                    {text: "Type", value: "tipe_mobil"},
                    {text: "Proprietor", value: "kategori_aset"},
                    {text: "Availability", value: "ketersediaan_mobil"},
                    {text: "Status Contract", value: "status_kontrak"},
                    {text: "", value: "actions"},
                ],
                car: new FormData,
                cars: [],
                carsPartner: [],
                form: { 
                    no_plat:null,
                    nama_mobil:null,
                    jenis_transmisi:null,
                    jenis_bahan_bakar:null,
                    warna_mobil:null,
                    kapasitas_penumpang:null,
                    fasilitas_mobil:null,
                    no_stnk:null,
                    kategori_aset:null,
                    tgl_terakhir_service:null,
                    ketersediaan_mobil:null,
                    tarif_harian_mobil:null,
                    vol_bagasi:null,
                    tipe_mobil:null,
                    url_car_img:null,
                    idMitra:null,
                    tgl_mulai_kontrak:null,
                    tgl_selesai_kontrak:null,
                    status_kontrak:null,
                    nama_mitra:null,
                },
                proprietor: ['Company','Partner'],
                availability: ['Available','Occupied','Unavailable'],
                deleteId: '',
                editId: '',
                btnShow: false,
                calendar: false,
                calendar1: false,
                calendar2: false,
                mitraId: null,
                mitraName: null,
                url_car: null,
                selectedCar: null,
                preview_car: require('@/assets/noimgcar.png'),
                deadline: '',
                btnAlert: false,
                btnEdit: false,
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
                this.updateContract();
                var url = this.$api + '/car';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.cars = response.data.data;
                })
            },

            updateContract() {
                var url = this.$api + '/updateStatusContract';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                })
            },
            
            saveData() {
                this.getIdMitra(this.form.nama_mitra);
                this.car.append('no_plat', this.form.no_plat); 
                this.car.append('nama_mobil', this.form.nama_mobil); 
                this.car.append('jenis_transmisi', this.form.jenis_transmisi); 
                this.car.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                this.car.append('warna_mobil', this.form.warna_mobil); 
                this.car.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                this.car.append('fasilitas_mobil', this.form.fasilitas_mobil); 
                this.car.append('no_stnk', this.form.no_stnk); 
                this.car.append('kategori_aset', this.form.kategori_aset); 
                this.car.append('tgl_terakhir_service', this.form.tgl_terakhir_service);
                this.car.append('ketersediaan_mobil', this.form.ketersediaan_mobil); 
                this.car.append('tarif_harian_mobil', this.form.tarif_harian_mobil);
                this.car.append('vol_bagasi', this.form.vol_bagasi); 
                this.car.append('tipe_mobil', this.form.tipe_mobil);
                this.car.append('url_car_img', this.url_car); 

                if(this.form.kategori_aset == 'Partner'){
                    this.car.append('idMitra', this.mitraId);
                    this.car.append('tgl_mulai_kontrak', this.form.tgl_mulai_kontrak);
                    this.car.append('tgl_selesai_kontrak', this.form.tgl_selesai_kontrak);
                    this.car.append('status_kontrak', this.form.status_kontrak);
                }
                var url = this.$api + '/car' 
                this.load = true; 
                this.$http.post(url, this.car, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : 'multipart/form-data'
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
                this.preview_car = require('@/assets/noimgcar.png');
            },

            updateData() { 
                this.getIdMitra(this.form.nama_mitra);
                this.car.append('id',this.editId);
                this.car.append('no_plat',this.form.no_plat);
                this.car.append('nama_mobil',this.form.nama_mobil);
                this.car.append('jenis_transmisi',this.form.jenis_transmisi);
                this.car.append('jenis_bahan_bakar',this.form.jenis_bahan_bakar);
                this.car.append('warna_mobil',this.form.warna_mobil);
                this.car.append('kapasitas_penumpang',this.form.kapasitas_penumpang);
                this.car.append('fasilitas_mobil',this.form.fasilitas_mobil);
                this.car.append('no_stnk',this.form.no_stnk);
                this.car.append('kategori_aset',this.form.kategori_aset);
                this.car.append('tgl_terakhir_service',this.form.tgl_terakhir_service);
                this.car.append('ketersediaan_mobil',this.form.ketersediaan_mobil);
                this.car.append('tarif_harian_mobil',this.form.tarif_harian_mobil);
                this.car.append('url_car_img',this.form.url_car_img);
                this.car.append('tipe_mobil',this.form.tipe_mobil);
                this.car.append('vol_bagasi',this.form.vol_bagasi);
                this.car.append('url_car_img', this.url_car);

                if(this.form.kategori_aset == 'Partner'){
                    this.car.append('idMitra',this.mitraId);
                    this.car.append('tgl_mulai_kontrak',this.form.tgl_mulai_kontrak);
                    this.car.append('tgl_selesai_kontrak',this.form.tgl_selesai_kontrak);
                    this.car.append('status_kontrak',this.form.status_kontrak);
                }
                
                var url = this.$api + '/update_car'; 
                this.load = true; 
                this.$http.post(url, this.car, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type' : 'multipart/form-data'

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

                this.preview_car = require('@/assets/noimgcar.png');
            },
            
            deleteData() {
                var url = this.$api + '/car/' + this.deleteId; 
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
                this.getNameMitra(item.idMitra);
                this.inputType = 'Update'; 
                this.dialogType = 'Are you sure you want to save these changes?';
                this.editId = item.id;
                this.form.no_plat = item.no_plat;
                this.form.nama_mobil = item.nama_mobil;
                this.form.jenis_transmisi = item.jenis_transmisi;
                this.form.jenis_bahan_bakar = item.jenis_bahan_bakar;
                this.form.warna_mobil = item.warna_mobil;
                this.form.kapasitas_penumpang = item.kapasitas_penumpang;
                this.form.fasilitas_mobil = item.fasilitas_mobil;
                this.form.no_stnk = item.no_stnk;
                this.form.kategori_aset = item.kategori_aset;
                this.form.tgl_terakhir_service = item.tgl_terakhir_service;
                this.form.ketersediaan_mobil = item.ketersediaan_mobil;
                this.form.tarif_harian_mobil = item.tarif_harian_mobil;
                this.form.vol_bagasi = item.vol_bagasi;
                this.form.tipe_mobil = item.tipe_mobil;
                this.form.url_car_img = item.url_car_img;

                if(item.kategori_aset == 'Partner'){
                    this.form.nama_mitra = this.mitraName; 
                    this.form.tgl_mulai_kontrak = item.tgl_mulai_kontrak;
                    this.form.tgl_selesai_kontrak = item.tgl_selesai_kontrak;
                    this.form.status_kontrak = item.status_kontrak;        
                }
                this.dialog = true;   
            },

            showHandler(item) {
                this.getNameMitra(item.idMitra);
                this.inputType = 'Show';
                this.btnShow = true; 
                this.editId = item.id; 
                this.form.no_plat = item.no_plat;
                this.form.nama_mobil = item.nama_mobil;
                this.form.jenis_transmisi = item.jenis_transmisi;
                this.form.jenis_bahan_bakar = item.jenis_bahan_bakar;
                this.form.warna_mobil = item.warna_mobil;
                this.form.kapasitas_penumpang = item.kapasitas_penumpang;
                this.form.fasilitas_mobil = item.fasilitas_mobil;
                this.form.no_stnk = item.no_stnk;
                this.form.kategori_aset = item.kategori_aset;
                this.form.tgl_terakhir_service = item.tgl_terakhir_service;
                this.form.ketersediaan_mobil = item.ketersediaan_mobil;
                this.form.tarif_harian_mobil = item.tarif_harian_mobil;
                this.form.vol_bagasi = item.vol_bagasi;
                this.form.tipe_mobil = item.tipe_mobil;
                this.form.url_car_img = item.url_car_img;
                if(item.kategori_aset == 'Partner'){
                    this.form.nama_mitra = this.mitraName; 
                    this.form.tgl_mulai_kontrak = item.tgl_mulai_kontrak;
                    this.form.tgl_selesai_kontrak = item.tgl_selesai_kontrak;
                    this.form.status_kontrak = item.status_kontrak;
                }
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
                this.resetForm();
                this.readData();
            },

            cancel() {
                this.resetForm(); 
                this.readData(); 
                this.dialog = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
                this.preview_car = require('@/assets/noimgcar.png');
            },

            unshow(){
                this.btnShow = false;
                this.dialog = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
                this.resetForm();
            },

            resetForm() { 
                this.form = {
                    no_plat:null,
                    nama_mobil:null,
                    jenis_transmisi:null,
                    jenis_bahan_bakar:null,
                    warna_mobil:null,
                    kapasitas_penumpang:null,
                    fasilitas_mobil:null,
                    no_stnk:null,
                    kategori_aset:null,
                    tgl_terakhir_service:null,
                    ketersediaan_mobil:null,
                    tarif_harian_mobil:null,
                    vol_bagasi:null,
                    tipe_mobil:null,
                    url_car_img:null,
                    idMitra:null,
                    tgl_mulai_kontrak:null,
                    tgl_selesai_kontrak:null,
                    status_kontrak:null,
                };
            },

            getIdMitra(nameMitra) {
                var url = this.$api +'/idpartner/'+ nameMitra;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                     this.mitraId = response.data.data;
                })
            },

            getNameMitra(idMitra) {
                var url = this.$api +'/namepartner/'+ idMitra;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mitraName = response.data.data;
                    this.form.nama_mitra = this.mitraName; 
                })
                
            },

            onPickFile() {
                this.$refs.fileInput.click();
            },

            uploadImg(event) {

                let url_car = event.target.files[0];
                this.url_car = url_car;
                this.preview_car = URL.createObjectURL(url_car);
            },

            getdeadlineColor(id){
                if (id == 'Active') return 'green' 
                else if (id == 'Warning') return 'orange'
                else if (id == 'Inactive' ) return 'error'
            },

            getdeadlineText (id) {
                if (id == 'Active') return 'Active' 
                else if (id == 'Warning') return 'Warning'
                else if (id == 'Inactive' ) return 'Inactive'
                
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
            this.getIdMitra();
            this.getNameMitra();
        },
    };
</script>