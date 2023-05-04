// Maps IRS f1040 (2020) field names to field names we use
// Expects form with input fields matching those in example sample
// From https://www.irs.gov/pub/irs-prior/f1040--2020.pdf
export const F1040_2020_FIELDNAMES_MAP: { [key: string]: string } = {
	"topmostSubform[0].Page1[0].FilingStatus[0].c1_01[0]": "filing_status_c[0]",
	"topmostSubform[0].Page1[0].FilingStatus[0].c1_01[1]": "filing_status_c[1]",
	"topmostSubform[0].Page1[0].FilingStatus[0].c1_01[2]": "filing_status_c[2]",
	"topmostSubform[0].Page1[0].FilingStatus[0].c1_01[3]": "filing_status_c[3]",
	"topmostSubform[0].Page1[0].FilingStatus[0].c1_01[4]": "filing_status_c[4]",
	"topmostSubform[0].Page1[0].FilingStatus[0].f1_01[0]": "filing_status_f",
	"topmostSubform[0].Page1[0].f1_02[0]": "fname",
	"topmostSubform[0].Page1[0].f1_03[0]": "lname",
	"topmostSubform[0].Page1[0].YourSocial[0].f1_04[0]": "SSN",
	"topmostSubform[0].Page1[0].f1_05[0]": "fname_spouse",
	"topmostSubform[0].Page1[0].f1_06[0]": "lname_spouse",
	"topmostSubform[0].Page1[0].SpousesSocial[0].f1_07[0]": "SSN_spouse",
	"topmostSubform[0].Page1[0].Address[0].f1_08[0]": "address_street",
	"topmostSubform[0].Page1[0].Address[0].f1_09[0]": "address_apt",
	"topmostSubform[0].Page1[0].Address[0].f1_10[0]": "address_city",
	"topmostSubform[0].Page1[0].Address[0].f1_11[0]": "address_state",
	"topmostSubform[0].Page1[0].Address[0].f1_12[0]": "address_zip",
	"topmostSubform[0].Page1[0].Address[0].f1_13[0]": "foreign_country",
	"topmostSubform[0].Page1[0].Address[0].f1_14[0]": "foreign_provice",
	"topmostSubform[0].Page1[0].Address[0].f1_15[0]": "foreign_postal",
	"topmostSubform[0].Page1[0].c1_02[0]": "c1_02[0]",
	"topmostSubform[0].Page1[0].c1_03[0]": "c1_03[0]",
	"topmostSubform[0].Page1[0].c1_04[0]": "c1_04[0]",
	"topmostSubform[0].Page1[0].c1_04[1]": "c1_04[1]",
	"topmostSubform[0].Page1[0].c1_05[0]": "c1_05[0]",
	"topmostSubform[0].Page1[0].c1_06[0]": "c1_06[0]",
	"topmostSubform[0].Page1[0].c1_07[0]": "c1_07[0]",
	"topmostSubform[0].Page1[0].c1_08[0]": "c1_08[0]",
	"topmostSubform[0].Page1[0].c1_09[0]": "c1_09[0]",
	"topmostSubform[0].Page1[0].c1_10[0]": "c1_10[0]",
	"topmostSubform[0].Page1[0].c1_11[0]": "c1_11[0]",
	"topmostSubform[0].Page1[0].Dependents_ReadOrder[0].c1_12[0]": "dependents_more_than_4",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow1[0].f1_16[0]": "dependents_1_1",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow1[0].f1_17[0]": "dependents_1_2",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow1[0].f1_18[0]": "dependents_1_3",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow1[0].c1_13[0]": "dependents_1_4",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow1[0].c1_14[0]": "dependents_1_5",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow2[0].f1_19[0]": "dependents_2_1",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow2[0].f1_20[0]": "dependents_2_2",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow2[0].f1_21[0]": "dependents_2_3",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow2[0].c1_15[0]": "dependents_2_4",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow2[0].c1_16[0]": "dependents_2_5",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow3[0].f1_22[0]": "dependents_3_1",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow3[0].f1_23[0]": "dependents_3_2",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow3[0].f1_24[0]": "dependents_3_3",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow3[0].c1_17[0]": "dependents_3_4",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow3[0].c1_18[0]": "dependents_3_5",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow4[0].f1_25[0]": "dependents_4_1",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow4[0].f1_26[0]": "dependents_4_2",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow4[0].f1_27[0]": "dependents_4_3",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow4[0].c1_19[0]": "dependents_4_4",
	"topmostSubform[0].Page1[0].Table_Dependents[0].BodyRow4[0].c1_20[0]": "dependents_4_5",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_28[0]": "f_1",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_29[0]": "f_2a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_30[0]": "f_2b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_31[0]": "f_3a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_32[0]": "f_3b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_33[0]": "f_4a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_34[0]": "f_4b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_35[0]": "f_5a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_36[0]": "f_5b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_37[0]": "f_6a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_38[0]": "f_6b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].c1_21[0]": "c1_21[0]",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_39[0]": "f_7",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_40[0]": "f_8",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_41[0]": "f_9",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].Line10-12_ReadOrder[0].f1_42[0]": "f_10a",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].Line10-12_ReadOrder[0].f1_43[0]": "f_10b",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_44[0]": "f_10c",
	"topmostSubform[0].Page1[0].Lines1-11_ReadOrder[0].f1_45[0]": "f_11",
	"topmostSubform[0].Page1[0].f1_46[0]": "f_12",
	"topmostSubform[0].Page1[0].f1_47[0]": "f_13",
	"topmostSubform[0].Page1[0].f1_48[0]": "f_14",
	"topmostSubform[0].Page1[0].f1_49[0]": "f_15",
	"topmostSubform[0].Page2[0].c2_01[0]": "f_16_c[1]",
	"topmostSubform[0].Page2[0].c2_02[0]": "f_16_c[2]",
	"topmostSubform[0].Page2[0].c2_03[0]": "f_16_c[3]",
	"topmostSubform[0].Page2[0].f2_01[0]": "f_16_c[3]_",
	"topmostSubform[0].Page2[0].f2_02[0]": "f_16",
	"topmostSubform[0].Page2[0].f2_03[0]": "f_17",
	"topmostSubform[0].Page2[0].f2_04[0]": "f_18",
	"topmostSubform[0].Page2[0].f2_05[0]": "f_19",
	"topmostSubform[0].Page2[0].f2_06[0]": "f_20",
	"topmostSubform[0].Page2[0].f2_07[0]": "f_21",
	"topmostSubform[0].Page2[0].f2_08[0]": "f_22",
	"topmostSubform[0].Page2[0].f2_09[0]": "f_23",
	"topmostSubform[0].Page2[0].f2_10[0]": "f_24",
	"topmostSubform[0].Page2[0].Line25_ReadOrder[0].f2_11[0]": "f_25a",
	"topmostSubform[0].Page2[0].Line25_ReadOrder[0].f2_12[0]": "f_25b",
	"topmostSubform[0].Page2[0].Line25_ReadOrder[0].f2_13[0]": "f_25c",
	"topmostSubform[0].Page2[0].Lines26-27_ReadOrder[0].f2_14[0]": "f_25d",
	"topmostSubform[0].Page2[0].Lines26-27_ReadOrder[0].f2_15[0]": "f_26",
	"topmostSubform[0].Page2[0].Lines27-32_ReadOrder[0].f2_16[0]": "f_27",
	"topmostSubform[0].Page2[0].Lines27-32_ReadOrder[0].f2_17[0]": "f_28",
	"topmostSubform[0].Page2[0].Lines27-32_ReadOrder[0].f2_18[0]": "f_29",
	"topmostSubform[0].Page2[0].Lines27-32_ReadOrder[0].f2_19[0]": "f_30",
	"topmostSubform[0].Page2[0].Lines27-32_ReadOrder[0].f2_20[0]": "f_31",
	"topmostSubform[0].Page2[0].Line32-33_ReadOrder[0].f2_21[0]": "f_32",
	"topmostSubform[0].Page2[0].f2_22[0]": "f_33",
	"topmostSubform[0].Page2[0].f2_23[0]": "f_34",
	"topmostSubform[0].Page2[0].c2_04[0]": "c2_04[0]",
	"topmostSubform[0].Page2[0].f2_24[0]": "f_35a",
	"topmostSubform[0].Page2[0].RoutingNo[0].f2_25[0]": "f_35b",
	"topmostSubform[0].Page2[0].c2_05[0]": "f_35c[1]",
	"topmostSubform[0].Page2[0].c2_05[1]": "f_35c[2]",
	"topmostSubform[0].Page2[0].AccountNo[0].f2_26[0]": "f_35d",
	"topmostSubform[0].Page2[0].f2_27[0]": "f_36",
	"topmostSubform[0].Page2[0].f2_28[0]": "f_37",
	"topmostSubform[0].Page2[0].f2_32[0]": "f_38",
	"topmostSubform[0].Page2[0].c2_6[0]": "c2_6[0]",
	"topmostSubform[0].Page2[0].c2_6[1]": "c2_6[1]",
	"topmostSubform[0].Page2[0].f2_33[0]": "f2_33[0]",
	"topmostSubform[0].Page2[0].f2_34[0]": "f2_34[0]",
	"topmostSubform[0].Page2[0].f2_35[0]": "f2_35[0]",
	"topmostSubform[0].Page2[0].f2_36[0]": "f2_36[0]",
	"topmostSubform[0].Page2[0].f2_37[0]": "f2_37[0]",
	"topmostSubform[0].Page2[0].f2_38[0]": "f2_38[0]",
	"topmostSubform[0].Page2[0].f2_39[0]": "f2_39[0]",
	"topmostSubform[0].Page2[0].f2_40[0]": "f2_40[0]",
	"topmostSubform[0].Page2[0].f2_41[0]": "f2_41[0]",
	"topmostSubform[0].Page2[0].f2_42[0]": "f2_42[0]",
	"topmostSubform[0].Page2[0].f2_43[0]": "f2_43[0]",
	"topmostSubform[0].Page2[0].c2_07[0]": "c2_07[0]",
	"topmostSubform[0].Page2[0].f2_44[0]": "f2_44[0]",
	"topmostSubform[0].Page2[0].f2_45[0]": "f2_45[0]",
	"topmostSubform[0].Page2[0].f2_46[0]": "f2_46[0]",
	"topmostSubform[0].Page2[0].f2_47[0]": "f2_47[0]",
};
