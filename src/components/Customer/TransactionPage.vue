<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1200px" min-height="500px">
                    <v-row align="center" justify="center" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="200px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> My Transaction </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row class="ml-5 mt-8">
                      <v-tabs v-model="tabs" background-color="transparent" left>
                        <v-tab class="tabtxt indigo--text"> <v-icon color="indigo">mdi-car-key</v-icon> Renting</v-tab>
                        <v-tab class="tabtxt indigo--text"> <v-icon color="indigo">mdi-credit-card-outline</v-icon> Payment</v-tab>
                        <v-tab class="tabtxt indigo--text"> <v-icon color="indigo">mdi-clipboard-text-outline</v-icon> History </v-tab>
                      </v-tabs>
                    </v-row>
                    <v-tabs-items class="mt-3" v-model="tabs">
                    <!-- Rent Table -->
                        <v-tab-item>
                            <v-row align="end" justify="end" class="mt-2 mr-5">
                            <v-col cols="4">
                                <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                            </v-col>
                            <v-tooltip v-if="customer.status_akun == 'Active'" bottom color="indigo">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-if="customer.status_akun == 'Active'" @click="dialogForm1 = true" large class="mx-2" fab dark color="indigo" v-bind="attrs" v-on="on">
                                        <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span class="btnhint">New Rent Order</span>
                            </v-tooltip>
                            </v-row>
                            <v-divider class="mx-4 mt-8"></v-divider>
                            <v-data-table height="250px" class="datacust mx-4" :headers="headersRent" :items="rents" :search="search">
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-tooltip bottom color="indigo">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn @click="showHandler(item)" class="mx-2 mr-2" fab dark x-small color="indigo" v-bind="attrs" v-on="on">
                                                <v-icon dark>mdi-eye</v-icon>
                                            </v-btn>
                                        </template>
                                        <span class="btnhint">Show Data Rent</span>
                                    </v-tooltip>
                                    <v-tooltip bottom color="warning">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn @click="editHandler(item)" v-if="item.status_transaksi == 'Havent placed an order yet' || item.status_transaksi == 'Your request has been rejected!'" class="mx-2 mr-2" fab dark x-small color="warning" v-bind="attrs" v-on="on">
                                                <v-icon dark>mdi-pencil</v-icon>
                                            </v-btn>
                                        </template>
                                        <span class="btnhint">Edit Data Rent</span>
                                    </v-tooltip>
                                    <v-tooltip bottom color="success">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn v-if="item.status_transaksi == 'Havent placed an order yet' || item.status_transaksi == 'Your request has been rejected!'" @click="applyHandler(item)" class="mx-2 mr-2" fab dark x-small color="success" v-bind="attrs" v-on="on">
                                                <v-icon dark>mdi-check-bold</v-icon>
                                            </v-btn>
                                        </template>
                                        <span class="btnhint">Place Order</span>
                                    </v-tooltip>
                                    <v-tooltip bottom color="error">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn v-if="item.status_transaksi == 'Havent placed an order yet' || item.status_transaksi == 'Your request is being processed! Waiting CS response' || item.status_transaksi == 'Your request has been rejected!'" @click="deleteHandler(item)" class="mx-2 mr-2" fab dark x-small color="error" v-bind="attrs" v-on="on">
                                                <v-icon dark>mdi-close-thick</v-icon>
                                            </v-btn>
                                        </template>
                                        <span class="btnhint">Cancel Order</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-tab-item>
                    <!-- Payment Table -->
                        <v-tab-item>
                            <v-divider class="mx-4 mt-8"></v-divider>
                            <v-data-table height="250px" class="datacust mx-4" :headers="headersPay" :items="payments" :search="search">
                                <template v-slot:[`item.actions2`]="{ item }">
                                    <v-btn v-if="item.status_transaksi != 'Your payment is being processed! Waiting CS response' && item.status_transaksi == 'Please make payment immediately and complete the data payment!' || item.status_transaksi == 'Your payment has been rejected!'" @click="editHandler2(item)" class="mx-2 mr-2" fab dark x-small color="success">
                                            <v-icon dark>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status_transaksi == 'Your payment is being processed! Waiting CS response' || item.status_transaksi == 'Your payment has been accepted!'" @click="showHandler2(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
                                        <v-icon dark>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-tab-item>
                    <!-- History Table -->
                        <v-tab-item>
                            <v-data-table height="250px" class="datacust mx-4" :headers="headersHistory" :items="transactions" :search="search">
                                <template v-slot:[`item.actions4`]="{ item }">
                                    <v-btn v-if="item.rating_ajr == null " @click="editHandler3(item)" class="mx-2 mr-2" fab dark x-small color="warning">
                                        <v-icon dark>mdi-star</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status_transaksi == 'Transaction completed!'" @click="readDataNota(item)" class="mx-2 mr-2" fab dark x-small color="error">
                                        <v-icon dark>mdi-receipt</v-icon>
                                    </v-btn>
                                </template>
                        </v-data-table>
                        </v-tab-item>
                    </v-tabs-items>
                    <!-- Form 1 -->
                    <v-dialog v-model="dialogForm1" persistent max-width="600px"> 
                        <v-card> 
                            <v-card-title>
                                <span class="headline">Rent Form</span> 
                            </v-card-title> 
                            <v-card-text> 
                                <v-container> 
                                    <v-autocomplete @change="currentTime" class="formtxt" v-model="form.jenis_transaksi" :items="rentType" :rules="rentTypeRules" label="Which one you need to rent?"></v-autocomplete>
                                    <v-row>
                                        <v-col>
                                            <v-dialog ref="dialog1" v-model="calendar" :return-value.sync="form.tgl_mulai_sewa" persistent width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field class="formtxt" :rules="calenderRules" v-model="form.tgl_mulai_sewa" label="Date start" v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="form.tgl_mulai_sewa" :min="date">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="calendar= false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog1.save(form.tgl_mulai_sewa)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-col>
                                        <v-col>
                                            <v-dialog ref="dialog2" v-model="time" :return-value.sync="form.wkt_mulai_sewa" persistent width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field :rules="timeRules" v-model="form.wkt_mulai_sewa" label="Time start" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-time-picker v-model="form.wkt_mulai_sewa">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="time = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog2.save(form.wkt_mulai_sewa)">OK</v-btn>
                                                </v-time-picker>
                                            </v-dialog>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-n2">
                                        <v-col>
                                            <v-dialog ref="dialog3" v-model="calendar2" :return-value.sync="form.tgl_selesai_sewa" persistent width="290px" >
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field :rules="calender2Rules" class="formtxt" v-model="form.tgl_selesai_sewa" label="Date end" v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="form.tgl_selesai_sewa" :min="form.tgl_mulai_sewa">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="calendar2 = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog3.save(form.tgl_selesai_sewa)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-col>
                                        <v-col>
                                            <v-dialog ref="dialog4" v-model="time2" :return-value.sync="form.wkt_selesai_sewa" persistent width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field :rules="time2Rules" v-model="form.wkt_selesai_sewa" label="Time end" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-time-picker v-model="form.wkt_selesai_sewa">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="time2 = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog4.save(form.wkt_selesai_sewa)">OK</v-btn>
                                                </v-time-picker>
                                            </v-dialog>
                                        </v-col>
                                    </v-row>
                                </v-container>  
                            </v-card-text> 
                            <v-card-actions>
                              <v-spacer></v-spacer> 
                              <v-btn class="font-weight-bold" color="error" text @click="cancelForm1"> Cancel </v-btn>
                              <v-btn class="font-weight-bold" v-if="form.jenis_transaksi != null && form.tgl_mulai_sewa != null && form.wkt_mulai_sewa != null && form.tgl_selesai_sewa != null && form.wkt_selesai_sewa != null" color="success" text @click="toDialogForm2"> Next </v-btn> 
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                    <!-- Form 2 -->
                    <v-dialog v-model="dialogForm2" persistent width="1200px"> 
                        <v-card v-model="readDataCar"> 
                            <v-card-title>
                                <span class="headline">Select Car</span> 
                            </v-card-title> 
                            <v-card-text> 
                                <v-data-table height="auto" class="datacust mx-4" :headers="listCar" :items="cars">
                                    <template v-slot:[`item.url_car_img`]="{ item }">
                                        <v-img class="my-3" width="200px" height="100px" :src="$imgloader+item.url_car_img"></v-img>
                                    </template>
                                    <template v-slot:[`item.action`]="{ item }">
                                        <v-btn @click="selectedCar(item)" class="mx-2 mr-2" fab dark x-small v-if="form.idCar == null" color="success">
                                            <v-icon dark>mdi-check-bold</v-icon>
                                        </v-btn>
                                        <v-btn @click="unselectedCar" class="mx-2 mr-2" fab dark x-small v-if="btnActive == true && form.idCar == item.id" color="error">
                                            <v-icon dark>mdi-close-thick</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table> 
                            </v-card-text> 
                            <v-card-actions>
                              <v-spacer></v-spacer> 
                                <v-btn color="error" class="font-weight-bold" text @click="cancelForm2"> Cancel </v-btn>
                                <v-btn class="font-weight-bold" v-if="form.jenis_transaksi != 'Car + Driver' && btnActive==true " color="warning" text @click="setForm"> Save </v-btn>
                                <v-btn  class="font-weight-bold" v-if="form.jenis_transaksi != 'Car + Driver' && btnActive==true && btnEditRent == false" color="success" text @click="storeRenting"> Order </v-btn>
                                <v-btn class="font-weight-bold" v-if="form.jenis_transaksi == 'Car + Driver' && btnActive==true " color="indigo" text @click="dialogForm3 = true"> Next </v-btn> 
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                    <!-- Form 3 -->
                    <v-dialog v-model="dialogForm3" persistent width="1200px"> 
                        <v-card> 
                            <v-card-title>
                                <span class="headline">Select Driver</span> 
                            </v-card-title> 
                            <v-card-text> 
                                <v-data-table height="auto" class="datacust mx-4" :headers="listDriver" :items="drivers" :search="search">
                                    <template v-slot:[`item.url_foto_driver`]="{ item }">
                                        <v-img class="my-3" width="100px" height="100px" :src="$imgloader+item.url_foto_driver"></v-img>
                                    </template> 
                                    <template v-slot:[`item.action`]="{ item }">
                                        <v-btn @click="selectedDriver(item)" class="mx-2 mr-2" fab dark x-small v-if="form.idDriver == null" color="success">
                                            <v-icon dark>mdi-check-bold</v-icon>
                                        </v-btn>
                                        <v-btn @click="unselectedDriver" class="mx-2 mr-2" fab dark x-small v-if="btnActive == true && form.idDriver == item.id" color="error">
                                            <v-icon dark>mdi-close-thick</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table> 
                            </v-card-text> 
                            <v-card-actions>
                              <v-spacer></v-spacer> 
                              <v-btn class="font-weight-bold" color="error" text @click="cancelForm3"> Cancel </v-btn>
                              <v-btn class="font-weight-bold" color="warning" text @click="setForm"> Save </v-btn> 
                              <v-btn v-if="btnEditRent == false" class="font-weight-bold" color="success" text @click="storeRenting"> Order </v-btn>
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                    <!-- Form Confirm -->
                    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                      <v-card>
                          <v-card-title>
                              <span class="headline"> Warning! </span>
                          </v-card-title>
                          <v-card-text v-html="dialogText"> {{ dialogText }} </v-card-text>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                              <v-btn color="blue darken-1" text @click="setDialog">Yes</v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <!-- Form Show -->
                    <v-dialog v-model="dialogFormShow" persistent width="1000px"> 
                        <v-card> 
                            <v-card-title>
                                <span class="headline">Show Data Renting</span> 
                            </v-card-title> 
                            <v-card-text> 
                                <v-container> 
                                    <v-autocomplete class="formtxt" v-model="form.jenis_transaksi" :items="rentType" :rules="rentTypeRules" label="Which one you need to rent?" :readonly="btnShowRent == true"></v-autocomplete>
                                    <v-row>
                                        <v-col>
                                            <v-text-field class="formtxt"  v-model="form.tgl_mulai_sewa" label="Date start" :readonly="btnShowRent == true"></v-text-field>
                                            <v-text-field :readonly="btnShowRent == true" class="formtxt" v-model="form.tgl_selesai_sewa" label="Date end" ></v-text-field>
                                            <v-text-field  v-model="form.initial_duration" label="Duration (days)" :readonly="btnShowRent == true" ></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field  v-model="form.wkt_mulai_sewa" label="Time start" :readonly="btnShowRent == true" ></v-text-field> 
                                            <v-text-field  v-model="form.wkt_selesai_sewa" label="Time end" :readonly="btnShowRent == true" ></v-text-field>  
                                            <v-text-field  v-model="form.sub_total_pembayaran" label="Sub total cost" :readonly="btnShowRent == true" ></v-text-field> 
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" justify="center">
                                        <v-card rounded="10" color="yellow" width="900px" max-height="220px">
                                            <v-card-title class="pengenaltxt">Selected Car</v-card-title>
                                            <v-row class="mx-3">
                                                <v-col cols="3">
                                                    <v-img class="mb-3 mt-0" width="200px" height="130px" :src="$imgloader+selectedCarShow.url_car_img"></v-img>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.no_plat" label="Plat Number" :readonly="btnShowRent == true"></v-text-field>
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.nama_mobil" label="Name" :readonly="btnShowRent == true"></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.jenis_bahan_bakar" label="Fuel" :readonly="btnShowRent == true"></v-text-field>
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.tarif_harian_mobil" label="Daily Cost" :readonly="btnShowRent == true"></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.kapasitas_penumpang" label="Total Passanger" :readonly="btnShowRent == true"></v-text-field>
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedCarShow.fasilitas_mobil" label="Facility" :readonly="btnShowRent == true"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-row> 
                                    <v-row v-if="form.jenis_transaksi == 'Car + Driver'" class="mt-8" align="center" justify="center">
                                        <v-card rounded="10" color="yellow" width="900px" max-height="300px">
                                            <v-card-title class="pengenaltxt">Selected Drive</v-card-title>
                                            <v-row class="mx-3">
                                                <v-col cols="3">
                                                    <v-img class=" mt-0 ml-5" width="150px" height="150px" :src="$imgloader+selectedDriverShow.url_foto_driver"></v-img>
                                                    <v-rating v-model="selectedDriverShow.rerata_rating" background-color="grey" color="indigo" readonly ></v-rating>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.nama_driver" label="Name" :readonly="btnShowRent == true"></v-text-field>
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.gender_driver" label="Gender" :readonly="btnShowRent == true"></v-text-field>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.kemampuan_bahasa" label="Languange" :readonly="btnShowRent == true"></v-text-field>
                                                    <v-text-field background-color="white" class="formtxt" dense rounded filled v-model="selectedDriverShow.tarif_harian_driver" label="Daily Cost" :readonly="btnShowRent == true"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-row> 
                                </v-container>  
                            </v-card-text> 
                            <v-card-actions>
                                <v-spacer></v-spacer> 
                                <v-btn color="blue darken-1" class="font-weight-bold" text @click="closeFormShow"> Close </v-btn>
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                    <!-- Form Payment -->
                    <v-dialog v-model="dialogFormPayment" persistent width="500px"> 
                        <v-card> 
                            <v-card-title>
                                <span class="headline" v-if="btnShowPay == false">Update Payment</span> 
                                <span class="headline" v-if="btnShowPay == true" >Show Payment</span> 
                            </v-card-title> 
                            <v-card-text> 
                                <v-container> 
                                    <p class="pengenaltxt">Cost Breakdown</p>
                                    <v-text-field class="formtxt" v-model="form.jenis_transaksi" label="Item" readonly></v-text-field>
                                    <v-row>
                                        <v-col>
                                            <v-text-field class="formtxt" v-model="form.tgl_pengembalian" label="Date Return" readonly></v-text-field>
                                            <v-text-field class="formtxt" v-model="form.initial_duration" label="Duration" readonly></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="form.wkt_pengembalian" label="Time Return" readonly></v-text-field>
                                            <v-text-field class="formtxt" v-model="form.final_duration" label="Extension" readonly></v-text-field>
                                            
                                        </v-col>
                                    </v-row>
                                    <v-text-field class="formtxt" v-model="form.sub_total" label="Sub Total Cost" readonly></v-text-field>
                                    <v-text-field class="formtxt" v-model="form.ext_cost" label="Extension Cost" readonly></v-text-field>
                                    <v-divider></v-divider>
                                    <v-autocomplete :readonly="btnShowPay == true" class="formtxt mt-5" v-model="form.metode_pembayaran" :items="payMethod" :rules="payMethodRules" label="Payment method"></v-autocomplete>
                                    <v-autocomplete :readonly="btnShowPay == true" @change="selectedPromo(form.idPromo)" class="formtxt" v-model="form.idPromo" :items="promos" :rules="payMethodRules" label="Promo"></v-autocomplete>
                                    <v-text-field v-if="form.idPromo != null" class="formtxt" v-model="form.discount" label="Discount" readonly></v-text-field>
                                    <v-text-field class="formtxt" v-model="form.total_cost" label="Total Cost" readonly></v-text-field>
                                    <div v-if="form.metode_pembayaran == 'Cashless'">
                                        <v-card class="mt-5" rounded="10" color="yellow" min-height="220px">
                                            <v-card-title class="pengenaltxt pt-1 pb-1">Payment Slip</v-card-title>
                                            <v-img v-if="btnEditPay == false" :src="$imgloader+form.url_bukti_pembayaran" width="330px" height="150px" class="mx-12 mt-1 mb-5"></v-img>
                                            <v-img v-if="btnEditPay == true" :src="preview_payment" width="330px" height="150px" class="mx-12 mt-1 mb-5"></v-img>
                                            <v-btn v-if="btnEditPay == true" small @click="onPickFile" class="iconedit2 ml-10 mt-n10" fab dark color="error">
                                                <v-icon dark>mdi-image-edit</v-icon>
                                            </v-btn>
                                            <input v-if="btnEditPay == true" type="file" style="display: none" @change="upload_payment" ref="fileInput">
                                        </v-card>
                                    </div>
                                </v-container>  
                            </v-card-text> 
                            <v-card-actions>
                                <v-spacer></v-spacer> 
                                <v-btn class="font-weight-bold" color="error" text @click="closePayment"> Close </v-btn>
                                <v-btn class="font-weight-bold" color="success" v-if="btnShowPay == false" text @click="storeHandler"> Save </v-btn>
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                    <!-- Form Rating -->
                    <v-dialog v-model="dialogFormRating" persistent width="500px"> 
                        <v-card> 
                            <v-card-title>
                                <span class="headline">Rating</span>
                            </v-card-title> 
                            <v-card-text> 
                                <v-container> 
                                    <p class="pengenaltxt">AJR</p>
                                    <v-rating class="pl-3 ml-10" v-model="form.rating_ajr" background-color="grey" color="warning" half-increments hover length="5" size="50" value="3"></v-rating>
                                    <v-textarea solo solo-inverted color="warning" class="formtxt" v-model="form.comment_ajr" counter label="Comment" hint="Max. 100 char"></v-textarea>
                                    <v-card width="500px" height="2px" color="black"></v-card>
                                    <p v-if="editIdDriver != null" class="pengenaltxt mt-5">Driver</p>
                                    <v-rating v-if="editIdDriver != null" class="pl-3 ml-10" v-model="form.rating_driver" background-color="grey" color="warning" half-increments hover length="5" size="50" value="3"></v-rating>
                                    <v-textarea v-if="editIdDriver != null" solo solo-inverted class="formtxt" v-model="form.comment_driver" hint="Max. 100 char" counter label="Comment"></v-textarea>
                                </v-container>  
                            </v-card-text> 
                            <v-card-actions>
                                <v-spacer></v-spacer> 
                                <v-btn class="font-weight-bold" color="error" text @click="closeRating"> Close </v-btn>
                                <v-btn class="font-weight-bold" color="success" text @click="storeRating"> Save </v-btn>
                            </v-card-actions> 
                        </v-card> 
                    </v-dialog>
                </v-card>
            </v-row>
            <!-- Nota Template Web -->
            <v-dialog v-model="notaWeb" persistent width="630px">
                <v-card>
                    <div>
                        <v-btn @click="downloadPdf" fab dark x-small class="mt-5 ml-5" color="success">
                            <v-icon dark>mdi-printer</v-icon>
                        </v-btn>
                        <v-btn @click="notaWeb = false" class="alignright mt-5 mr-5" fab dark x-small color="error">
                            <v-icon dark>mdi-close-thick</v-icon>
                        </v-btn> 
                    </div>
                    <div id="notaPdf">
                        <v-card-text class="mt-n3">
                            <v-row class="mx-5">
                               <v-col>
                                    <p class="notatitle text-center mt-5" style="margin-left: 30px; text-align:center">Nota Transaksi</p> 
                                    <p class="notatitle text-center" style="margin-left: 30px; text-align:center">Atma Jogja Rental</p>
                               </v-col>
                            </v-row>
                            <p class="mx-1 mt-n2 text-center">-----------------------------------------------------------------------------------------------------------------</p>
                            <v-row class="mx-5" style="margin-left:20px">
                                <v-col cols="auto">
                                    <v-text-field class="notabody mt-n3 pa-0" style="letter-spacing: 1px;" flat solo hide-details v-model="datanota.id" readonly></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="notabody mt-n3 pa-0" style="margin-left:100px; letter-spacing: 1px;" flat solo hide-details v-model="datanota.tgl_pengembalian" readonly></v-text-field>
                                </v-col>
                            </v-row>
                            <p class="mx-1 mt-n2 text-center">-----------------------------------------------------------------------------------------------------------------</p>
                            <v-row class="mx-5 mt-n3" style="margin-left:20px">
                                <v-col cols="auto">
                                    <p class="notabody" style="letter-spacing: 1px;">Cust:</p> 
                                    <p class="notabody" style="letter-spacing: 1px;">CSV     :</p>
                                    <p v-if="datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">Driver  :</p>
                                </v-col>
                                <v-col cols="auto" class="ml-n3">
                                    <p class="notabody" style="letter-spacing: 1px;">{{ customer.nama_customer }}</p>
                                    <p class="notabody" style="letter-spacing: 1px;">{{ selectedEmployeeShow.nama_pegawai }}</p>
                                    <p v-if="datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ selectedDriverShow.nama_driver }}</p>
                                </v-col>
                                <v-col cols="auto" style="margin-left:150px">
                                    <p class="notabody" style="letter-spacing: 1px;">Promo :</p>
                                </v-col>
                                <v-col cols="auto" class="ml-n3">
                                    <p class="notabody" style="letter-spacing: 1px;">{{ datanota.idPromo }}</p>
                                </v-col>
                            </v-row>
                            <p class="mx-1 mt-n2 text-center">-----------------------------------------------------------------------------------------------------------------</p>
                            <v-row class="mx-5" style="margin-left:10px">
                                <v-col cols="auto">
                                    <p class="notabody" style="letter-spacing: 1px;">Start Date :</p>
                                    <p class="notabody" style="letter-spacing: 1px;">Finish Date :</p>
                                    <p class="notabody" style="letter-spacing: 1px;">Return Date :</p>
                                </v-col>
                                <v-col cols="auto" style="margin-left:20px">
                                    <p class="notabody" style="letter-spacing: 1px;">{{ datanota.tgl_mulai_sewa }}</p>
                                    <p class="notabody" style="letter-spacing: 1px;">{{ datanota.tgl_selesai_sewa }}</p>
                                    <p class="notabody" style="letter-spacing: 1px;">{{ datanota.tgl_pengembalian }}</p>
                                </v-col>
                            </v-row>
                            <p class="mx-1 mt-n2 text-center">-----------------------------------------------------------------------------------------------------------------</p>
                            <v-row class="mx-5" style="margin-left:10px">
                                <v-col>
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">Item</p>
                                    <p class="notabody" style="letter-spacing: 1px;">Car</p>
                                    <p class="notabody" v-if="datanota.jenis_transaksi == 'Car + Driver'" style="letter-spacing: 1px;">Driver</p>
                                </v-col>
                                <v-col>
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">Cost</p>
                                    <p class="notabody" style="letter-spacing: 1px;">{{ selectedCarShow.tarif_harian_mobil }}</p>
                                    <p v-if="datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ selectedDriverShow.tarif_harian_driver }}</p>
                                </v-col>
                                <v-col>
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">Duration</p>
                                    <p v-if="init <= 1" class="notabody" style="letter-spacing: 1px;">{{ init }} day</p>
                                    <p v-if="init > 1" class="notabody" style="letter-spacing: 1px;">{{ init }} days</p>
                                    <p v-if="init <= 1 && datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ init }} day</p>
                                    <p v-if="init > 1 && datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ init }} days</p>
                                </v-col>
                                <v-col v-if="final != 0">
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">Extension</p>
                                    <p v-if="final <= 1" class="notabody" style="letter-spacing: 1px;">{{ final }} day</p>
                                    <p v-if="final > 1" class="notabody" style="letter-spacing: 1px;">{{ final }} days</p>
                                    <p v-if="final <= 1 && datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ final }} day</p>
                                    <p v-if="final > 1 && datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ final }} days</p>
                                </v-col>
                                <v-col>
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">Sub total</p>
                                    <p class="notabody" style="letter-spacing: 1px;">{{ (init + final)*selectedCarShow.tarif_harian_mobil }}</p>
                                    <p v-if="datanota.jenis_transaksi == 'Car + Driver'" class="notabody" style="letter-spacing: 1px;">{{ (init + final)*selectedDriverShow.tarif_harian_driver }}</p>
                                    <p class="notabody boldtxt" style="letter-spacing: 1px;">{{ datanota.sub_total_pembayaran }}</p>
                                </v-col>
                            </v-row>
                            <p class="mx-1 mt-n2 text-center">-----------------------------------------------------------------------------------------------------------------</p>
                            <v-row align="right" class="mx-5" >
                                <v-col cols="6">
                                </v-col>
                                <v-col cols="3">
                                    <p class="notabody" style="letter-spacing: 1px;">Discount</p>
                                    <p class="notabody" style="letter-spacing: 1px;">Extension Cost</p>
                                    <p class="notabody" style="letter-spacing: 1px;">Total</p>
                                </v-col>
                                <v-col cols="3">
                                    <p class="notabody" style="text-align:right; margin-right:10px; letter-spacing: 1px;">{{ datanota.total_potongan_promo }}</p>
                                    <p v-if="datanota.total_denda == null" class="notabody" style="text-align:right; margin-right:10px; letter-spacing: 1px;">0</p>
                                    <p class="notabody" style="text-align:right; margin-right:10px; letter-spacing: 1px;">{{ datanota.total_denda }}</p>
                                    <p class="notabody boldtxt" style="text-align:right; margin-right:10px; letter-spacing: 1px;">{{ datanota.total_pembayaran }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-card>
            </v-dialog>
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

    .pengenaltxt{
        font-family: Rubik;
        font-size: 20px;
        font-weight: bold;
    }

    .btnhint{
        font-family: Rubik;
        font-size: 10px;
        font-weight: bold;
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }

    .formtxt{
        font-family: Rubik;
    }

    .tabtxt{
        font-family: Akshar;
        font-weight: bold;
    }

    .headline{
        font-family: Akshar;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

    .notatitle{
        font-family: Rubik;
        font-weight: bold;
        font-size: 20px;
        left: 40px;
    }

    .notabody{
        font-family: Akshar;
        font-size: 15px;
        color: black;
    }

    .boldtxt{
        font-weight: bold;
    }

    .alignright{
        left: 490px;
    }

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>

<script> 
    import { jsPDF } from "jspdf";

    export default {
        name: "TransactionPage",
        data() { 
            return {
                load: false,
                date: null,
                draft: false,
                snackbar: false,
                error_message: '',
                color: '',
                headersRent: [
                    {text: "Transaction ID", value: "id"},
                    {text: "Date Transaction", value: "tgl_transaksi"}, 
                    {text: "Type", value: "jenis_transaksi"},
                    {text: "Status Transaction", value: "status_transaksi"},
                    {text: "Note", value: "note"},
                    {text: "", value: "actions"},
                ],
                headersPay: [
                    {text: "Transaction ID", value: "id"},
                    {text: "Return Date", value: "tgl_pengembalian"},
                    {text: "Status Transaction", value: "status_transaksi"},
                    {text: "Note", value: "note"},
                    {text: "", value: "actions2"},
                ],
                headersHistory: [
                    {text: "Transaction ID", value: "id"}, 
                    {text: "Date Transaction", value: "tgl_transaksi"}, 
                    {text: "Type", value: "jenis_transaksi"},                
                    {text: "Status Transaction", value: "status_transaksi"},
                    {text: "", value: "actions4"},
                ],
                listCar: [
                    {text: "Car Image", value: "url_car_img"},
                    {text: "Name", value: "nama_mobil"},
                    {text: "Car Type", value: "tipe_mobil"},
                    {text: "Transmision", value: "jenis_transmisi"},
                    {text: "Fuel", value: "jenis_bahan_bakar"},
                    {text: "Color", value: "warna_mobil"},
                    {text: "Baggage", value: "vol_bagasi"},
                    {text: "Facility", value: "fasilitas_mobil"},
                    {text: "Daily Rent Cost", value: "tarif_harian_mobil"},
                    {text: "", value: "action"},
                ],
                listDriver: [
                    {text: "Driver Image", value: "url_foto_driver"},
                    {text: "Name", value: "nama_driver"},
                    {text: "Languange", value: "kemampuan_bahasa"},
                    {text: "Rating", value: "rerata_rating"},
                    {text: "Daily Cost", value: "tarif_harian_driver"},
                    {text: "", value: "action"},
                ],
                tabs: null,
                dialogForm1: false, 
                dialogForm2: false, 
                dialogForm3: false, 
                dialogConfirm: false,
                dialogFormShow: false,
                dialogFormPayment: false,
                dialogFormRating: false,
                notaWeb: false,
                inputType: 'Create',
                transaction: new FormData,
                customer: [],
                rents: [],
                payments: [],
                ratings: [],
                transactions: [],
                datanota:[],
                cars: [],
                drivers: [],
                selectedCarShow: [],
                selectedDriverShow: [],
                selectedEmployeeShow: [],
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
                    datetime_pengembalian: null,
                    wkt_pengembalian: null,
                    url_bukti_pembayaran: null,
                    metode_pembayaran: null,
                    initial_duration: null,
                    final_duration: null,
                    sub_total: null,
                    ext_cost: null,
                    total_cost: null,
                    discount: null,
                    rating_ajr: null,
                    comment_ajr: null,
                    rating_driver: null,
                    comment_driver: null,
                },
                payMethod: ['Cash', 'Cashless'],
                payMethodRules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                rentType: ['Only Car', 'Car + Driver'],
                rentTypeRules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                calendar: false,
                calenderRules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                time: false,
                timeRules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                calendar2: false,
                calender2Rules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                time2: false,
                time2Rules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                calendar3: false,
                calender3Rules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                time3: false,
                time3Rules: [
                    (v) => !!v || 'Cannot Be Empty!',
                ],
                search: null, 
                deleteId: '',
                editId: '',
                editIdDriver: '',
                btnActive: false,
                btnInactive: false,
                formTitle: null,
                btnShowRent: false,
                btnEditRent: false,
                btnCancelRent: true,
                btnApplyRent: true,
                btnEditPay: false,
                text: null,
                holdIdCar: null,
                holdIdDriver: null,
                promos: [],
                promo: null,
                btnShowPay: false,
                dialogType: null,
                cancelRent: false,
                init: null,
                final: null,
            };
        },

        methods: { 
            downloadPdf(){
                const doc = new jsPDF('p', 'pt', 'a4');
                doc.html(document.getElementById("notaPdf"), 
                {
                    margin: [10, 20, 10, 20],
                    callback: function (pdf) {
                        pdf.save("NotaAjr.pdf")
                    }
                }); 
            },

            setDialog(){
                if(this.dialogType == "Are you sure want to edit this rent? <br/><strong>If yes, then you have to re-select the car and driver</strong>"){
                    this.dialogForm1 = true;
                }else if(this.dialogType == 'Are you sure want to cancel this rent?'){
                    this.deleteData();
                }else if(this.dialogType == "Are you sure don't want to order right now?"){
                    this.storeRenting();
                }else if(this.dialogType == 'Are you sure want to order now?'){
                    this.applyOrder();
                }else if(this.dialogType == 'Are you sure you have entered the correct data?'){
                    this.storePayment();
                }
            },

            currentTime(){
                var today = new Date();
                if(this.form.jenis_transaksi == 'Car + Driver'){
                    var diff = 3;
                }else{
                    diff = 1;
                }
                var dd = String(today.getDate() + diff).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                this.date = yyyy + '-' + mm + '-' + dd;
                
            },

            readDataCustomer() {
                var url = this.$api + '/user/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customer = response.data.data;
                })
            },

            readDataRent(){
                var url = this.$api + '/showRent/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.rents = response.data.data;
                })
            },

            readDataPayment(){
                var url = this.$api + '/showPayment/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.payments = response.data.data;
                })
            },

            readDataTransaction(){
                var url = this.$api + '/showTransaction/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transactions = response.data.data;
                })
            },

            readDataNota(item){
                var url = this.$api + '/transaction/' + item.id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.datanota = response.data.data;
                    this.notaWeb = true;
                    var diffTime = Math.abs(new Date(item.tgl_mulai_sewa) - new Date(item.tgl_selesai_sewa));
                    var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                    var mod = diffHours % 24;
                    if(mod>3){
                        var diffDays = Math.ceil(diffHours / 24);
                    }else if (mod<=3){
                        diffDays = Math.floor(diffHours / 24);
                    }
                    this.init = diffDays;
                    diffTime = Math.abs(new Date(item.tgl_pengembalian) - new Date(item.tgl_selesai_sewa));
                    diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                    mod = diffHours % 24;
                    if(mod>3){
                        diffDays = Math.ceil(diffHours / 24);
                    }else if (mod<=3){
                        diffDays = Math.floor(diffHours / 24);
                    }
                    this.final = diffDays;
                    this.readSelectedEmployee(item.idEmployee);
                    this.readSelectedCar(item.idCar);
                    this.readSelectedDriver(item.idDriver);
                })
            },

            readDataCar(){
                var url = this.$api + '/listcarr';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.cars = response.data.data;
                    console.log(this.cars);
                })
            },         

            readDataDriver(){
                var url = this.$api + '/listdriver';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            readSelectedEmployee(id){
                var url = this.$api + '/readEmployee/' + id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.selectedEmployeeShow = response.data.data;
                })
            },

            readSelectedCar(id){
                var url = this.$api + '/readCar/' + id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.selectedCarShow = response.data.data;
                })
            },

            readSelectedDriver(id){
                var url = this.$api + '/readDriver/' + id;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.selectedDriverShow = response.data.data;
                })
            },

            readDataPromo() {
                var url = this.$api + '/listKodePromo';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promos = response.data.data;
                
                })
            },

            toDialogForm2(){
                this.readDataCar();
                this.dialogForm2 = true;
            },

            setForm(){
                if(this.btnEditRent == true){
                    this.editRenting();
                }else{
                    this.draft = true;
                    this.dialogType = "Are you sure don't want to order right now?";
                    this.dialogConfirm = true;
                }
            },

            setTextConfirm(){
                 if(this.btnEditRent == true){
                    this.text = "Are you sure want to edit this transaction? If Yes, then you've to choose new Car or Driver";
                }else if(this.btnCancelRent == true) {
                    this.text = "Are you sure want to cancel this transaction?";
                }else if(this.btnApplyRent == true) {
                    this.text = "Are you sure want to edit this transaction? If Yes, then you can't edit this transaction anymore";
                }
            },

            selectedCar(item){
                this.btnActive = true;
                this.form.idCar = item.id;
                this.form.dailyCostCar = item.tarif_harian_mobil;
            },

            unselectedCar(){
                this.btnActive = false;
                this.form.idCar = null;
                this.form.dailyCostCar = null;
            },

            carAvailability1(){
                if(this.cancelRent == true){
                    var data = 'Available'
                }else if(this.cancelRent == false){
                    data = 'Occupied'
                }

                let newData = {
                    ketersediaan_mobil : data,
                };

                var url = this.$api + '/selectedCar/' + this.form.idCar  ;
                this.$http.put(url, newData, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.readDataCar();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            carAvailability2(){
                let newData = {
                    ketersediaan_mobil : 'Available',
                };

                var url = this.$api + '/selectedCar/' + this.holdIdCar ;
                this.$http.put(url, newData, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.readDataCar();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            selectedDriver(item){
                this.btnActive = true;
                this.form.idDriver = item.id;
                this.form.dailyCostDriver = item.tarif_harian_driver;
            },

            unselectedDriver(){
                this.btnActive = false;
                this.form.idDriver = null;
                this.form.dailyCostDriver = null;
            },

            driverAvailability1(){
                if(this.cancelRent == true || this.form.jenis_transaksi == 'Car Only'){
                    var data = 'Available'
                }else if(this.cancelRent == false){
                    data = 'Occupied'
                }

                let newData = {
                    status_ketersediaan_driver : data,
                };

                var url = this.$api + '/selectedDriver/' + this.form.idDriver ;
                this.$http.put(url, newData, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.readDataCar();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            driverAvailability2(){
                let newData = {
                    status_ketersediaan_driver : 'Available',
                };

                var url = this.$api + '/selectedDriver/' + this.holdIdDriver ;
                this.$http.put(url, newData, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false; 
                    this.readDataCar();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            cancelForm1(){
                this.resetForm(); 
                //this.readData(); 
                this.dialogForm1 = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
            },

            cancelForm2(){
                //this.readData(); 
                this.dialogForm2 = false; 
                this.dialogConfirm = false; 
                this.inputType = 'Create';
            },

            cancelForm3(){
                //this.readData(); 
                this.dialogForm3 = false; 
            },

            resetForm(){
                this.form = {
                    tgl_transaksi: null,
                    jenis_transaksi: null,
                    idDriver: null,
                    idCar: null,
                    dailyCostCar: null,
                    dailyCostDriver: null,
                    tgl_mulai_sewa: null,
                    wkt_mulai_sewa: null,
                    tgl_selesai_sewa: null,
                    wkt_selesai_sewa: null,
                    tgl_pengembalian: null,
                    url_bukti_pembayaran: null,
                    metode_pembayaran: null,
                    initial_duration: null,
                    final_duration: null,
                    sub_total: null,
                    ext_cost: null,
                    total_cost: null,
                    discount: null,
                    rating_ajr: null,
                    comment_ajr: null,
                    rating_driver: null,
                    comment_driver: null,
                }
            },

            // Renting Function
            storeRenting(){
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); 
                var yyyy = today.getFullYear();
                var tgl_pengembalian = yyyy + '-' + mm + '-' + dd;
                var wkt_pengembalian = String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0');
                this.form.tgl_transaksi = tgl_pengembalian + ' ' + wkt_pengembalian;

                var mulai_sewa = new Date(this.form.tgl_mulai_sewa +' '+ this.form.wkt_mulai_sewa);
                var selesai_sewa = new Date(this.form.tgl_selesai_sewa +' '+ this.form.wkt_selesai_sewa);
                const diffTime = Math.abs(selesai_sewa - mulai_sewa);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                const mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }
                this.transaction.append('idCustomer',localStorage.getItem('id'));
                this.transaction.append('idCar',this.form.idCar);
                this.transaction.append('jenis_transaksi',this.form.jenis_transaksi);
                this.transaction.append('note','');

                if(this.draft == true){
                    this.transaction.append('status_transaksi',"Havent placed an order yet");
                }else if (this.draft == false){
                    this.transaction.append('status_transaksi',"Your request is being processed! Waiting CS response");
                }
                this.transaction.append('tgl_transaksi',this.form.tgl_transaksi);
                this.transaction.append('tgl_mulai_sewa',this.form.tgl_mulai_sewa +' '+ this.form.wkt_mulai_sewa);
                this.transaction.append('tgl_selesai_sewa',this.form.tgl_selesai_sewa +' '+ this.form.wkt_selesai_sewa);

                if(this.form.idDriver != null && this.form.jenis_transaksi == 'Car + Driver'){
                    this.transaction.append('idDriver',this.form.idDriver);
                    this.transaction.append('sub_total_pembayaran', ( (diffDays * this.form.dailyCostCar) + (diffDays * this.form.dailyCostDriver) ));
                }else if(this.form.jenis_transaksi == 'Only Car'){
                    this.transaction.append('sub_total_pembayaran', diffDays * this.form.dailyCostCar );
                }

                var url = this.$api + '/rent' 
                this.load = true; 
                this.$http.post(url, this.transaction, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.load = true; 
                    this.close(); 
                    this.draft = false;
                    this.carAvailability1();
                    this.driverAvailability1();
                    this.readDataRent(); // baca data
                    this.resetForm();
                    this.dialogConfirm = false; 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            editHandler(item){
                this.btnEditRent = true;
                this.dialogType = 'Are you sure want to edit this rent? <br/><strong>If yes, then you have to re-select the car and driver</strong>'
                this.dialogConfirm = true;
                this.editId = item.id;
                this.holdIdCar = item.idCar;
                this.holdIdDriver = item.idDriver;
                this.form.jenis_transaksi = item.jenis_transaksi;
                var mulai = new Date(item.tgl_mulai_sewa);
                var dd = String(mulai.getDate()).padStart(2, '0');
                var mm = String(mulai.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = mulai.getFullYear();
                var tgl_mulai = yyyy + '-' + mm + '-' + dd;
                var wkt_mulai = String(mulai.getHours()).padStart(2, '0') + ':' + String(mulai.getMinutes()).padStart(2, '0');
                this.form.tgl_mulai_sewa = tgl_mulai;
                this.form.wkt_mulai_sewa = wkt_mulai;

                var selesai = new Date(item.tgl_selesai_sewa);
                dd = String(selesai.getDate()).padStart(2, '0');
                mm = String(selesai.getMonth() + 1).padStart(2, '0'); //January is 0!
                yyyy = selesai.getFullYear();
                var tgl_selesai = yyyy + '-' + mm + '-' + dd;
                var wkt_selesai = String(selesai.getHours()).padStart(2, '0') + ':' + String(selesai.getMinutes()).padStart(2, '0');
                this.form.tgl_selesai_sewa = tgl_selesai;
                this.form.wkt_selesai_sewa = wkt_selesai;
            },

            editRenting(){
                var mulai_sewa = new Date(this.form.tgl_mulai_sewa +' '+ this.form.wkt_mulai_sewa);
                var selesai_sewa = new Date(this.form.tgl_selesai_sewa +' '+ this.form.wkt_selesai_sewa);
                const diffTime = Math.abs(selesai_sewa - mulai_sewa);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                const mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                if(this.form.idDriver != null && this.form.jenis_transaksi == 'Car + Driver'){
                    var id_Driver = this.form.idDriver;
                    this.form.sub_total_pembayaran = (diffDays * this.form.dailyCostCar) + (diffDays * this.form.dailyCostDriver);
                }else if(this.form.jenis_transaksi == 'Only Car'){
                    id_Driver = null;
                    this.form.sub_total_pembayaran =  diffDays * this.form.dailyCostCar;
                }

                console.log(this.form.dailyCostCar);

                let newData = {
                    tgl_mulai_sewa : this.form.tgl_mulai_sewa +' '+ this.form.wkt_mulai_sewa, 
                    tgl_selesai_sewa : this.form.tgl_selesai_sewa +' '+ this.form.wkt_selesai_sewa, 
                    jenis_transaksi : this.form.jenis_transaksi,
                    status_transaksi : "Havent placed an order yet",
                    sub_total_pembayaran : this.form.sub_total_pembayaran,
                    idCar : this.form.idCar,
                    idDriver : id_Driver,
                    note: '',
                }; 
                var url = this.$api + '/transaction/' + this.editId; 
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
                    this.btnEditRent = false;
                    this.dialogConfirm = false;
                    this.close(); 
                    this.carAvailability1();
                    this.driverAvailability1();
                    this.carAvailability2();
                    this.driverAvailability2();
                    this.readDataRent(); // baca data
                    this.resetForm();
                    this.unselected_Car(this.holdIdCar);
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            showHandler(item){
                this.btnShowRent = true;
                this.dialogFormShow = true;
                this.form.jenis_transaksi = item.jenis_transaksi;
                this.form.sub_total_pembayaran = item.sub_total_pembayaran;
                var mulai = new Date(item.tgl_mulai_sewa);
                var dd = String(mulai.getDate()).padStart(2, '0');
                var mm = String(mulai.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = mulai.getFullYear();
                var tgl_mulai = yyyy + '-' + mm + '-' + dd;
                var wkt_mulai = String(mulai.getHours()).padStart(2, '0') + ':' + String(mulai.getMinutes()).padStart(2, '0');
                this.form.tgl_mulai_sewa = tgl_mulai;
                this.form.wkt_mulai_sewa = wkt_mulai;

                var selesai = new Date(item.tgl_selesai_sewa);
                dd = String(selesai.getDate()).padStart(2, '0');
                mm = String(selesai.getMonth() + 1).padStart(2, '0'); //January is 0!
                yyyy = selesai.getFullYear();
                var tgl_selesai = yyyy + '-' + mm + '-' + dd;
                var wkt_selesai = String(selesai.getHours()).padStart(2, '0') + ':' + String(selesai.getMinutes()).padStart(2, '0');
                this.form.tgl_selesai_sewa = tgl_selesai;
                this.form.wkt_selesai_sewa = wkt_selesai;

                var mulai_sewa = new Date(item.tgl_mulai_sewa);
                var selesai_sewa = new Date(item.tgl_selesai_sewa);
                var diffTime = Math.abs(selesai_sewa - mulai_sewa);
                var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                var mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                this.form.initial_duration = diffDays;

                this.readSelectedCar(item.idCar);
                this.readSelectedDriver(item.idDriver);
            },

            applyHandler(item){
                this.dialogType = 'Are you sure want to order now?';
                this.dialogConfirm = true;
                this.editId = item.id
            },

            applyOrder(){
                let newData = {
                    status_transaksi: 'Your request is being processed! Waiting CS response',
                    note: '',
                }

                var url = this.$api + '/statusTransaction/' + this.editId 
                this.load = true; 
                this.$http.put(url, newData , { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.load = true; 
                    this.close(); 
                    this.dialogConfirm = false;
                    this.readDataRent();
                    this.resetForm(); // baca data
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            deleteHandler(item){
                this.dialogType = 'Are you sure want to cancel this rent?';
                this.cancelRent = true;
                this.dialogConfirm = true;
                this.deleteId = item.id;
                this.form.idCar = item.idCar;
                this.form.idDriver = item.idDriver;
            },

            deleteData(){
                var url = this.$api + '/transaction/' + this.deleteId; 
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
                    this.dialogConfirm = false;
                    this.close(); 
                    this.carAvailability1();
                    this.driverAvailability1();
                    this.readDataRent();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            closeFormShow(){
                this.dialogFormShow = false;
            },
            
            close(){
                this.dialogForm1 = false;
                this.dialogForm2 = false;
                this.dialogForm3 = false;
            },

            // Payment Function
            selectedPromo(kode){
                var url = this.$api + '/selectedPromo/' + kode;
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promo = response.data.data;
                    this.form.discount = (this.form.sub_total + this.form.ext_cost) * (this.promo / 100);
                    this.form.total_cost =  (this.form.sub_total + this.form.ext_cost) - this.form.discount;
                    
                })
            },

            editHandler2(item){
                this.readDataPromo();
                this.editId = item.id;
                this.btnEditPay = true;
                this.dialogFormPayment = true;
                this.form.url_bukti_pembayaran = item.url_bukti_pembayaran;
                this.form.metode_pembayaran = item.metode_pembayaran;
                this.form.jenis_transaksi = item.jenis_transaksi;
                this.form.sub_total = item.sub_total_pembayaran;
                this.form.idPromo = item.idPromo;

                var kembali = new Date(item.tgl_pengembalian);
                var dd = String(kembali.getDate()).padStart(2, '0');
                var mm = String(kembali.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = kembali.getFullYear();
                var tgl_kembali = yyyy + '-' + mm + '-' + dd;
                var wkt_kembali = String(kembali.getHours()).padStart(2, '0') + ':' + String(kembali.getMinutes()).padStart(2, '0');
                this.form.tgl_pengembalian = tgl_kembali;
                this.form.wkt_pengembalian = wkt_kembali;

                var mulai_sewa = new Date(item.tgl_mulai_sewa);
                var selesai_sewa = new Date(item.tgl_selesai_sewa);
                var diffTime = Math.abs(selesai_sewa - mulai_sewa);
                var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                var mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                this.form.initial_duration = diffDays;

                diffTime = Math.abs(kembali - selesai_sewa);
                diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                mod = diffHours % 24;
                if(mod>3){
                    diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                this.form.final_duration = diffDays; 
                
                this.form.ext_cost = (item.sub_total_pembayaran / this.form.initial_duration) * this.form.final_duration;
                
                if(this.form.idPromo == item.idPromo){
                    this.form.discount = item.total_potongan_promo;
                }
                

                if(this.form.idPromo == null){
                   this.form.total_cost =  (this.form.sub_total + this.form.ext_cost); 
                }else{
                    this.form.total_cost =  (this.form.sub_total + this.form.ext_cost) - this.form.discount;
                }
                
            },

            storeHandler(){
                this.dialogType = 'Are you sure you have entered the correct data?'
                this.dialogConfirm = true;
            },

            storePayment(){ 
                this.btnEditPayment = false;
                this.transaction.append('id',this.editId);
                this.transaction.append('idPromo',this.form.idPromo);
                this.transaction.append('status_transaksi', 'Your payment is being processed! Waiting CS response');
                this.transaction.append('total_potongan_promo', this.form.discount);
                this.transaction.append('sub_total_pembayaran',this.form.sub_total);
                this.transaction.append('total_denda',this.form.ext_cost);
                this.transaction.append('total_pembayaran', this.form.total_cost);
                this.transaction.append('metode_pembayaran', this.form.metode_pembayaran);
                this.transaction.append('note', '');

                if(this.form.metode_pembayaran == 'Cashless'){
                    this.transaction.append('url_bukti_pembayaran', this.form.url_bukti_pembayaran);
                }
                
                var url = this.$api + '/payment' 
                this.load = true; 
                this.$http.post(url, this.transaction, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = "green"; 
                    this.snackbar = true; 
                    this.load = true; 
                    this.dialogConfirm = false;
                    this.btnEditPay = false;
                    this.closePayment(); 
                    this.readDataPayment(); // baca data
                    this.resetForm(); 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = "red"; 
                    this.snackbar = true;
                    this.load = false; 
                });
            },

            showHandler2(item){
                this.btnShowPay = true;
                this.readDataPromo();
                this.editId = item.id;
                this.dialogFormPayment = true;
                this.form.url_bukti_pembayaran = item.url_bukti_pembayaran;
                this.form.metode_pembayaran = item.metode_pembayaran;
                this.form.jenis_transaksi = item.jenis_transaksi;
                this.form.sub_total = item.sub_total_pembayaran;
                this.form.idPromo = item.idPromo;

                var kembali = new Date(item.tgl_pengembalian);
                var dd = String(kembali.getDate()).padStart(2, '0');
                var mm = String(kembali.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = kembali.getFullYear();
                var tgl_kembali = yyyy + '-' + mm + '-' + dd;
                var wkt_kembali = String(kembali.getHours()).padStart(2, '0') + ':' + String(kembali.getMinutes()).padStart(2, '0');
                this.form.tgl_pengembalian = tgl_kembali;
                this.form.wkt_pengembalian = wkt_kembali;

                var mulai_sewa = new Date(item.tgl_mulai_sewa);
                var selesai_sewa = new Date(item.tgl_selesai_sewa);
                var diffTime = Math.abs(selesai_sewa - mulai_sewa);
                var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                var mod = diffHours % 24;
                if(mod>3){
                    var diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                this.form.initial_duration = diffDays;

                diffTime = Math.abs(kembali - selesai_sewa);
                diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
                mod = diffHours % 24;
                if(mod>3){
                    diffDays = Math.ceil(diffHours / 24);
                }else if (mod<=3){
                    diffDays = Math.floor(diffHours / 24);
                }

                this.form.final_duration = diffDays; 


                this.form.ext_cost = item.total_denda;
                this.form.discount = item.total_potongan_promo;
                this.form.total_cost = item.total_pembayaran;
            },

            closePayment(){
                this.dialogFormPayment = false;
                this.resetForm();
            },

            onPickFile() {
                this.$refs.fileInput.click();
            },

            upload_payment(event) {
            let url_payment = event.target.files[0];
            this.form.url_bukti_pembayaran = url_payment;
            this.preview_payment = URL.createObjectURL(url_payment);
            },

            // History Function
            editHandler3(item){
                this.editIdDriver = item.idDriver;
                this.editId = item.id;
                this.dialogFormRating = true;
            },

            storeRating(){
                
                let newData = {
                    rating_ajr : this.form.rating_ajr,
                    rating_driver : this.form.rating_driver,
                    komentar_ajr : this.form.comment_ajr,
                    komentar_driver : this.form.comment_driver,
                }; 
                var url = this.$api + '/rating/' + this.editId; 
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
                    this.updatAvgDriverRate();
                    this.closeRating(); 
                    this.readDataRent();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            updatAvgDriverRate(){
                if(this.editIdDriver != null){
                    this.transaction.append('id',this.editIdDriver);
                    var url = this.$api + '/updateAverage' 
                    this.load = true; 
                    this.$http.post(url, this.transaction, { 
                        headers: {
                            'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        }
                    }).then(response => {
                        this.error_message = response.data.message; 
                        this.color = "green"; 
                        this.snackbar = true; 
                        this.load = true; 
                        this.dialogConfirm = false;
                        this.btnEditPay = false; 
                    }).catch(error => {
                        this.error_message = error.response.data.message; 
                        this.color = "red"; 
                        this.snackbar = true;
                        this.load = false; 
                    });
                }
                this.closeRating(); 
            },

            closeRating(){
                this.dialogFormRating = false;
                this.resetForm();
            },
     
        },

        computed: {
            dialogText() {
                return this.dialogType;
            },
        },

        mounted() {
            this.readDataCustomer();
            this.readDataPayment();
            this.readDataRent();  
            this.readDataTransaction()  
            this.readDataCar();  
            this.readDataDriver();    
        },
    };
</script>