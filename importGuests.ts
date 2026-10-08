import dbConnect from './src/lib/mongodb';
import Guest from './src/models/Guest';

const guestsData = [
    { name: "Junior e Cleude", phone: "18 98803-2969", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Junior", confirmed: false }, { name: "Cleude", confirmed: false }] },
    { name: "Thiago e Juliana", phone: "18 99602-0747", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Thiago", confirmed: false }, { name: "Juliana", confirmed: false }] },
    { name: "Higor e família", phone: "18 99811-0650", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Higor", confirmed: false }, { name: "Cleyce", confirmed: false }, { name: "Oliver", confirmed: false }] },
    { name: "Alison e Ana", phone: "18 99738-6164", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Alison", confirmed: false }, { name: "Ana", confirmed: false }] },
    { name: "Ian e Ana", phone: "18 99815-0811", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Ian", confirmed: false }, { name: "Ana", confirmed: false }] },
    { name: "Lucas", phone: "18 99786-3668", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Lucas", confirmed: false }] },
    { name: "Gabriel", phone: "18 99663-3276", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Gabriel", confirmed: false }] },
    { name: "Alexandre e Fabiana", phone: "18 99790-1236", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Alexandre", confirmed: false }, { name: "Fabiana", confirmed: false }] },
    { name: "Levi e Adriana", phone: "18 99603-0266", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Levi", confirmed: false }, { name: "Adriana", confirmed: false }] },
    { name: "Jhonatan e Gabriela", phone: "18 99623-5994", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Jhonatan", confirmed: false }, { name: "Gabriela", confirmed: false }] },
    { name: "Rogério e família", phone: "18 99680-1920", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Rogério", confirmed: false }, { name: "Lucimara", confirmed: false }, { name: "Samuel", confirmed: false }, { name: "Rosa", confirmed: false }] },
    { name: "Elias e Elaine", phone: "18 99610-2618", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Elias", confirmed: false }, { name: "Elaine", confirmed: false }] },
    { name: "Meire", phone: "18 98802-4739", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Meire", confirmed: false }] },
    { name: "Carmem", phone: "18 93500-3166", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Carmem", confirmed: false }] },
    { name: "Hugo e Fátima", phone: "18 99790-0701", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Hugo", confirmed: false }, { name: "Fátima", confirmed: false }] },
    { name: "Rivaldo Jr. e família", phone: "18 99658-0171", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Rivaldo Jr.", confirmed: false }, { name: "Nathany", confirmed: false }, { name: "Laura", confirmed: false }] },
    { name: "Antônio Carlos e família", phone: "18 99673-1323", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Antônio Carlos", confirmed: false }, { name: "Cláudia", confirmed: false }, { name: "Maria Cecília", confirmed: false }] },
    { name: "Eduardo e Ingrid", phone: "18 99736-9523", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Eduardo", confirmed: false }, { name: "Ingrid", confirmed: false }] },
    { name: "Nilton e família", phone: "18 98805-5622", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Nilton", confirmed: false }, { name: "Dalvana", confirmed: false }, { name: "Eliza", confirmed: false }, { name: "Gabriel", confirmed: false }] },
    { name: "Brenda e Eduardo", phone: "18 99794-1179", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Brenda", confirmed: false }, { name: "Eduardo", confirmed: false }] },
    { name: "Sean", phone: "18 99748-1073", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Sean", confirmed: false }] },
    { name: "Pedro e Duda", phone: "18 93505-9495", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Pedro", confirmed: false }, { name: "Duda", confirmed: false }] },
    { name: "Vitor e família", phone: "67 99103-4995", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Vitor", confirmed: false }, { name: "Isadora", confirmed: false }, { name: "Bernardo", confirmed: false }] },
    { name: "Daniel e família", phone: "18 98152-0580", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Daniel", confirmed: false }, { name: "Elizângela", confirmed: false }, { name: "Mateus", confirmed: false }, { name: "João Pedro", confirmed: false }] },
    { name: "Nonato e família", phone: "18 98132-1702", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Nonato", confirmed: false }, { name: "Larissa", confirmed: false }, { name: "Benício", confirmed: false }] },
    { name: "João Paulo e Carol", phone: "18 98159-2234", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "João Paulo", confirmed: false }, { name: "Carol", confirmed: false }] },
    { name: "Kauã e Mariana", phone: "18 99639-6689", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Kauã", confirmed: false }, { name: "Mariana", confirmed: false }] },
    { name: "Luciano e família", phone: "18 98105-1300", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Luciano", confirmed: false }, { name: "Melissa", confirmed: false }, { name: "Isaac", confirmed: false }] },
    { name: "Leandro e família", phone: "18 99740-1468", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Leandro", confirmed: false }, { name: "Gabriela", confirmed: false }, { name: "Enzo", confirmed: false }, { name: "Emanuelly", confirmed: false }] },
    { name: "Maria Luiza", phone: "18 98188-7914", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Maria Luiza", confirmed: false }] },
    { name: "Mariana", phone: "18 98105-0184", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Mariana", confirmed: false }] },
    { name: "Natália", phone: "18 93505-0507", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Natália", confirmed: false }] },
    { name: "Ana Clara", phone: "18 99691-3981", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Ana Clara", confirmed: false }] },
    { name: "Henrique", phone: "18 99672-4216", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Henrique", confirmed: false }] },
    { name: "Ahmad e Letícia", phone: "53 9906-6957", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Ahmad", confirmed: false }, { name: "Letícia", confirmed: false }] },
    { name: "Mayco e família", phone: "18 99752-1343", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Mayco", confirmed: false }, { name: "Daviane", confirmed: false }, { name: "Lucas", confirmed: false }, { name: "Gabriel", confirmed: false }] },
    { name: "Isabele", phone: "18 99784-6095", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Isabele", confirmed: false }] },
    { name: "Giovana Storini", phone: "18 99795-3826", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Giovana Storini", confirmed: false }] },
    { name: "Jhonatan e Kellen", phone: "18 99810-8410", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Jhonatan", confirmed: false }, { name: "Kellen", confirmed: false }] },
    { name: "Alex e Suellen", phone: "18 99660-1881", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Alex", confirmed: false }, { name: "Suellen", confirmed: false }] },
    { name: "Manoel e família", phone: "18 99814-6225", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Manoel", confirmed: false }, { name: "Márcia", confirmed: false }, { name: "Moisés", confirmed: false }, { name: "Davi", confirmed: false }] },
    { name: "Marcelo e família", phone: "18 99741-2809", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Marcelo", confirmed: false }, { name: "Paula", confirmed: false }, { name: "Mariana", confirmed: false }, { name: "Miguel", confirmed: false }, { name: "Gabriel", confirmed: false }] },
    { name: "Ilton", phone: "18 99818-5799", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Ilton", confirmed: false }] },
    { name: "Ana Laura", phone: "18 98147-8738", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Ana Laura", confirmed: false }, { name: "Samuel", confirmed: false }] },
    { name: "Francisco", phone: "18 99137-6231", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Francisco", confirmed: false }] },
    { name: "Alerrandro", phone: "18 99622-3670", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Alerrandro", confirmed: false }] },
    { name: "João", phone: "18 99691-2997", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "João", confirmed: false }] },
    { name: "Débora", phone: "18 99147-4030", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Débora", confirmed: false }] },
    { name: "Wallace e Rafa", phone: "21 98119-0782", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Wallace", confirmed: false }, { name: "Rafa", confirmed: false }] },
    { name: "Aldo e família", phone: "+44 7879 345204", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Aldo", confirmed: false }, { name: "Luciana", confirmed: false }, { name: "Vitória", confirmed: false }, { name: "Heloísa", confirmed: false }] },
    { name: "Djalma e Lucimara", phone: "18 99696-0968", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Djalma", confirmed: false }, { name: "Lucimara", confirmed: false }] },
    { name: "Gabriel Omote e família", phone: "18 99824-1784", side: "noivo", invitedViaWhatsapp: false, members: [{ name: "Gabriel", confirmed: false }, { name: "Carol", confirmed: false }, { name: "Heitor", confirmed: false }] }
];

async function runImport() {
    try {
        await dbConnect();
        console.log("Conectado ao MongoDB com sucesso!");

        await Guest.insertMany(guestsData);
        console.log("Importação de todos os convidados concluída com sucesso!");
        process.exit(0);
    } catch (error) {
        console.error("Erro na importação:", error);
        process.exit(1);
    }
}

runImport();