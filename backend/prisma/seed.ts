import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate unique 12-digit Aadhaar and 10-char PAN
function aadhaar(n: number): string {
  return String(100000000000 + n).slice(0, 12);
}
function pan(prefix: string, n: number): string {
  const digits = String(1000 + n).slice(-4);
  return `${prefix}${digits}${prefix[0]}`;
}

const users = [
  // Original 10
  { firstName: 'Nandan',   lastName: 'Acharya',    email: 'nandan@example.com',        mobile: '9876543210', mob2: '9123456789', aadh: aadhaar(1),  pan: pan('ABCDE', 1),  dob: '2000-01-15', pob: 'Bangalore',          addr: '123 MG Road, Bangalore 560001' },
  { firstName: 'Priya',    lastName: 'Sharma',      email: 'priya@example.com',          mobile: '8765432109', mob2: '',           aadh: aadhaar(2),  pan: pan('FGHIJ', 2),  dob: '1998-05-20', pob: 'Mumbai',             addr: '789 Andheri West, Mumbai 400053' },
  { firstName: 'Rahul',    lastName: 'Verma',       email: 'rahul.verma@example.com',    mobile: '7654321098', mob2: '9988776655', aadh: aadhaar(3),  pan: pan('RAHUL', 3),  dob: '1995-03-10', pob: 'Delhi',              addr: '42 Connaught Place, New Delhi 110001' },
  { firstName: 'Anjali',   lastName: 'Mehta',       email: 'anjali.mehta@example.com',   mobile: '9001234567', mob2: '',           aadh: aadhaar(4),  pan: pan('ANJAM', 4),  dob: '1997-11-25', pob: 'Ahmedabad',          addr: '5 CG Road, Ahmedabad 380006' },
  { firstName: 'Vikram',   lastName: 'Singh',       email: 'vikram.singh@example.com',   mobile: '8123456789', mob2: '7011223344', aadh: aadhaar(5),  pan: pan('VIKRS', 5),  dob: '1992-07-04', pob: 'Jaipur',             addr: '88 Pink City Road, Jaipur 302001' },
  { firstName: 'Sneha',    lastName: 'Iyer',        email: 'sneha.iyer@example.com',     mobile: '9345678901', mob2: '',           aadh: aadhaar(6),  pan: pan('SNEHI', 6),  dob: '2001-09-18', pob: 'Chennai',            addr: '22 Anna Salai, Chennai 600002' },
  { firstName: 'Arjun',    lastName: 'Nair',        email: 'arjun.nair@example.com',     mobile: '6789012345', mob2: '',           aadh: aadhaar(7),  pan: pan('ARJUN', 7),  dob: '1999-02-14', pob: 'Kochi',              addr: '3 Marine Drive, Kochi 682031' },
  { firstName: 'Pooja',    lastName: 'Reddy',       email: 'pooja.reddy@example.com',    mobile: '9812345670', mob2: '8012345670', aadh: aadhaar(8),  pan: pan('POOJA', 8),  dob: '1996-06-30', pob: 'Hyderabad',          addr: '9 Banjara Hills, Hyderabad 500034' },
  { firstName: 'Karan',    lastName: 'Malhotra',    email: 'karan.malhotra@example.com', mobile: '7890123456', mob2: '',           aadh: aadhaar(9),  pan: pan('KARAN', 9),  dob: '1993-12-05', pob: 'Chandigarh',         addr: '11 Sector 17, Chandigarh 160017' },
  { firstName: 'Divya',    lastName: 'Pillai',      email: 'divya.pillai@example.com',   mobile: '9567890123', mob2: '',           aadh: aadhaar(10), pan: pan('DIVYA', 10), dob: '2002-04-22', pob: 'Thiruvananthapuram', addr: '6 Statue Junction, Trivandrum 695001' },
  // 50+ more
  { firstName: 'Rohan',    lastName: 'Gupta',       email: 'rohan.gupta@example.com',    mobile: '9811122233', mob2: '',           aadh: aadhaar(11), pan: pan('ROHAN', 11), dob: '1994-08-12', pob: 'Lucknow',            addr: '15 Hazratganj, Lucknow 226001' },
  { firstName: 'Kavya',    lastName: 'Krishnan',    email: 'kavya.k@example.com',        mobile: '8922233344', mob2: '',           aadh: aadhaar(12), pan: pan('KAVYA', 12), dob: '2000-03-07', pob: 'Coimbatore',         addr: '77 Race Course Road, Coimbatore 641018' },
  { firstName: 'Aditya',   lastName: 'Bose',        email: 'aditya.bose@example.com',    mobile: '7033344455', mob2: '9933344455', aadh: aadhaar(13), pan: pan('ADITY', 13), dob: '1991-12-30', pob: 'Kolkata',            addr: '32 Park Street, Kolkata 700016' },
  { firstName: 'Meera',    lastName: 'Joshi',       email: 'meera.joshi@example.com',    mobile: '9144455566', mob2: '',           aadh: aadhaar(14), pan: pan('MEERA', 14), dob: '1999-07-19', pob: 'Pune',               addr: '56 FC Road, Pune 411004' },
  { firstName: 'Siddharth',lastName: 'Kulkarni',    email: 'siddharth.k@example.com',    mobile: '8055566677', mob2: '',           aadh: aadhaar(15), pan: pan('SIDDK', 15), dob: '1997-01-25', pob: 'Nashik',             addr: '88 CBS Road, Nashik 422001' },
  { firstName: 'Ananya',   lastName: 'Das',         email: 'ananya.das@example.com',     mobile: '9966677788', mob2: '8866677788', aadh: aadhaar(16), pan: pan('ANANY', 16), dob: '2003-06-11', pob: 'Bhubaneswar',        addr: '12 Bapuji Nagar, Bhubaneswar 751009' },
  { firstName: 'Nikhil',   lastName: 'Tiwari',      email: 'nikhil.tiwari@example.com',  mobile: '7177788899', mob2: '',           aadh: aadhaar(17), pan: pan('NIKHT', 17), dob: '1990-10-03', pob: 'Varanasi',           addr: '5 Lanka Road, Varanasi 221005' },
  { firstName: 'Ritika',   lastName: 'Saxena',      email: 'ritika.saxena@example.com',  mobile: '9088899900', mob2: '',           aadh: aadhaar(18), pan: pan('RITIK', 18), dob: '1996-04-28', pob: 'Agra',               addr: '20 Taj Ganj, Agra 282001' },
  { firstName: 'Yash',     lastName: 'Patel',       email: 'yash.patel@example.com',     mobile: '8199900011', mob2: '7199900011', aadh: aadhaar(19), pan: pan('YASHP', 19), dob: '2001-11-14', pob: 'Surat',              addr: '45 Ring Road, Surat 395003' },
  { firstName: 'Tanvi',    lastName: 'Shah',        email: 'tanvi.shah@example.com',     mobile: '9200011122', mob2: '',           aadh: aadhaar(20), pan: pan('TANVI', 20), dob: '1998-09-02', pob: 'Vadodara',           addr: '67 Alkapuri, Vadodara 390007' },
  { firstName: 'Gaurav',   lastName: 'Mishra',      email: 'gaurav.mishra@example.com',  mobile: '7311122233', mob2: '',           aadh: aadhaar(21), pan: pan('GAURA', 21), dob: '1993-02-17', pob: 'Bhopal',             addr: '14 MP Nagar, Bhopal 462011' },
  { firstName: 'Isha',     lastName: 'Kapoor',      email: 'isha.kapoor@example.com',    mobile: '9422233344', mob2: '8422233344', aadh: aadhaar(22), pan: pan('ISHAK', 22), dob: '2000-05-31', pob: 'Indore',             addr: '22 Vijay Nagar, Indore 452010' },
  { firstName: 'Shubham',  lastName: 'Pandey',      email: 'shubham.p@example.com',      mobile: '8533344455', mob2: '',           aadh: aadhaar(23), pan: pan('SHUBP', 23), dob: '1995-08-08', pob: 'Patna',              addr: '3 Bailey Road, Patna 800001' },
  { firstName: 'Nisha',    lastName: 'Rao',         email: 'nisha.rao@example.com',      mobile: '7644455566', mob2: '',           aadh: aadhaar(24), pan: pan('NISAR', 24), dob: '1997-12-22', pob: 'Vijayawada',         addr: '9 MG Road, Vijayawada 520010' },
  { firstName: 'Akash',    lastName: 'Chowdhury',   email: 'akash.c@example.com',        mobile: '9755566677', mob2: '8755566677', aadh: aadhaar(25), pan: pan('AKASH', 25), dob: '1992-06-15', pob: 'Guwahati',           addr: '7 GS Road, Guwahati 781007' },
  { firstName: 'Deepika',  lastName: 'Menon',       email: 'deepika.menon@example.com',  mobile: '8866677788', mob2: '',           aadh: aadhaar(26), pan: pan('DEEPM', 26), dob: '1999-03-09', pob: 'Kozhikode',          addr: '18 SM Street, Kozhikode 673001' },
  { firstName: 'Varun',    lastName: 'Khanna',      email: 'varun.khanna@example.com',   mobile: '9977788899', mob2: '',           aadh: aadhaar(27), pan: pan('VARUN', 27), dob: '1994-10-27', pob: 'Amritsar',           addr: '5 Golden Temple Road, Amritsar 143001' },
  { firstName: 'Bhavna',   lastName: 'Tripathi',    email: 'bhavna.t@example.com',       mobile: '7088899910', mob2: '9088899910', aadh: aadhaar(28), pan: pan('BHAVN', 28), dob: '2002-07-04', pob: 'Kanpur',             addr: '33 Mall Road, Kanpur 208001' },
  { firstName: 'Pranav',   lastName: 'Desai',       email: 'pranav.desai@example.com',   mobile: '9199900021', mob2: '',           aadh: aadhaar(29), pan: pan('PRAND', 29), dob: '1996-01-18', pob: 'Rajkot',             addr: '11 Race Course Road, Rajkot 360001' },
  { firstName: 'Swati',    lastName: 'Naik',        email: 'swati.naik@example.com',     mobile: '8200011132', mob2: '',           aadh: aadhaar(30), pan: pan('SWATI', 30), dob: '1998-04-30', pob: 'Mangalore',          addr: '25 Hampankatta, Mangalore 575001' },
  { firstName: 'Kunal',    lastName: 'Jain',        email: 'kunal.jain@example.com',     mobile: '9311122243', mob2: '8311122243', aadh: aadhaar(31), pan: pan('KUNAL', 31), dob: '1991-09-13', pob: 'Jodhpur',            addr: '66 Clock Tower, Jodhpur 342001' },
  { firstName: 'Pallavi',  lastName: 'Srivastava',  email: 'pallavi.s@example.com',      mobile: '7422233354', mob2: '',           aadh: aadhaar(32), pan: pan('PALLS', 32), dob: '2001-02-06', pob: 'Allahabad',          addr: '14 Civil Lines, Allahabad 211001' },
  { firstName: 'Hardik',   lastName: 'Modi',        email: 'hardik.modi@example.com',    mobile: '9533344465', mob2: '',           aadh: aadhaar(33), pan: pan('HARDM', 33), dob: '1995-07-21', pob: 'Gandhinagar',        addr: '8 Sector 11, Gandhinagar 382011' },
  { firstName: 'Riya',     lastName: 'Chatterjee',  email: 'riya.chat@example.com',      mobile: '8644455576', mob2: '9644455576', aadh: aadhaar(34), pan: pan('RIYAC', 34), dob: '2000-10-10', pob: 'Kolkata',            addr: '41 Ballygunge, Kolkata 700019' },
  { firstName: 'Vivek',    lastName: 'Pandita',     email: 'vivek.pandita@example.com',  mobile: '7755566687', mob2: '',           aadh: aadhaar(35), pan: pan('VIVEK', 35), dob: '1993-05-05', pob: 'Srinagar',           addr: '12 Residency Road, Srinagar 190001' },
  { firstName: 'Layla',    lastName: 'Fernandez',   email: 'layla.f@example.com',        mobile: '9866677798', mob2: '',           aadh: aadhaar(36), pan: pan('LAYLF', 36), dob: '1997-08-23', pob: 'Goa',                addr: '3 Calangute Beach Road, Goa 403516' },
  { firstName: 'Suresh',   lastName: 'Babu',        email: 'suresh.babu@example.com',    mobile: '8977788909', mob2: '7977788909', aadh: aadhaar(37), pan: pan('SUREB', 37), dob: '1989-03-16', pob: 'Madurai',            addr: '7 Anna Nagar, Madurai 625020' },
  { firstName: 'Kriti',    lastName: 'Agarwal',     email: 'kriti.agarwal@example.com',  mobile: '9088899920', mob2: '',           aadh: aadhaar(38), pan: pan('KRITA', 38), dob: '2003-01-28', pob: 'Meerut',             addr: '55 Shastri Nagar, Meerut 250001' },
  { firstName: 'Sameer',   lastName: 'Khan',        email: 'sameer.khan@example.com',    mobile: '7199900031', mob2: '',           aadh: aadhaar(39), pan: pan('SAMEK', 39), dob: '1994-11-11', pob: 'Aurangabad',         addr: '19 CIDCO, Aurangabad 431003' },
  { firstName: 'Poornima', lastName: 'Hegde',       email: 'poornima.h@example.com',     mobile: '9200011132', mob2: '8200011132', aadh: aadhaar(40), pan: pan('POORH', 40), dob: '1999-06-06', pob: 'Hubli',              addr: '30 Lamington Road, Hubli 580020' },
  { firstName: 'Devraj',   lastName: 'Chauhan',     email: 'devraj.c@example.com',       mobile: '8311122253', mob2: '',           aadh: aadhaar(41), pan: pan('DEVRC', 41), dob: '1992-04-04', pob: 'Shimla',             addr: '2 Mall Road, Shimla 171001' },
  { firstName: 'Muskan',   lastName: 'Siddiqui',    email: 'muskan.s@example.com',       mobile: '9422233364', mob2: '',           aadh: aadhaar(42), pan: pan('MUSKS', 42), dob: '2001-09-09', pob: 'Lucknow',            addr: '77 Gomti Nagar, Lucknow 226010' },
  { firstName: 'Tarun',    lastName: 'Mehrotra',    email: 'tarun.m@example.com',        mobile: '7533344475', mob2: '9533344475', aadh: aadhaar(43), pan: pan('TARUN', 43), dob: '1996-12-12', pob: 'Dehradun',           addr: '14 Rajpur Road, Dehradun 248001' },
  { firstName: 'Jasmine',  lastName: 'Kaur',        email: 'jasmine.kaur@example.com',   mobile: '9644455586', mob2: '',           aadh: aadhaar(44), pan: pan('JASMK', 44), dob: '1998-02-20', pob: 'Ludhiana',           addr: '6 BRS Nagar, Ludhiana 141012' },
  { firstName: 'Abhishek', lastName: 'Shukla',      email: 'abhishek.s@example.com',     mobile: '8755566697', mob2: '',           aadh: aadhaar(45), pan: pan('ABHIS', 45), dob: '1990-07-07', pob: 'Gorakhpur',          addr: '9 Golghar, Gorakhpur 273001' },
  { firstName: 'Trisha',   lastName: 'Banerjee',    email: 'trisha.b@example.com',       mobile: '9866677809', mob2: '8866677809', aadh: aadhaar(46), pan: pan('TRISB', 46), dob: '2002-11-17', pob: 'Durgapur',           addr: '33 City Centre, Durgapur 713216' },
  { firstName: 'Mohit',    lastName: 'Arora',       email: 'mohit.arora@example.com',    mobile: '7977788919', mob2: '',           aadh: aadhaar(47), pan: pan('MOHIA', 47), dob: '1995-05-25', pob: 'Faridabad',          addr: '22 NIT, Faridabad 121001' },
  { firstName: 'Sanya',    lastName: 'Verma',       email: 'sanya.verma@example.com',    mobile: '9088899930', mob2: '',           aadh: aadhaar(48), pan: pan('SANYV', 48), dob: '2000-08-18', pob: 'Gurgaon',            addr: '11 DLF Phase 2, Gurgaon 122002' },
  { firstName: 'Naveen',   lastName: 'Kumar',       email: 'naveen.kumar@example.com',   mobile: '8199900041', mob2: '7199900041', aadh: aadhaar(49), pan: pan('NAVEK', 49), dob: '1988-01-01', pob: 'Mysore',             addr: '5 Saraswathipuram, Mysore 570009' },
  { firstName: 'Charu',    lastName: 'Dixit',       email: 'charu.dixit@example.com',    mobile: '9200011142', mob2: '',           aadh: aadhaar(50), pan: pan('CHARD', 50), dob: '1997-10-14', pob: 'Gwalior',            addr: '17 Lashkar, Gwalior 474001' },
  { firstName: 'Rahul',    lastName: 'Nambiar',     email: 'rahul.nambiar@example.com',  mobile: '7311122263', mob2: '',           aadh: aadhaar(51), pan: pan('RAHN', 51),  dob: '2001-04-18', pob: 'Calicut',            addr: '12 Mavoor Road, Calicut 673004' },
  { firstName: 'Sunita',   lastName: 'Pandey',      email: 'sunita.p@example.com',       mobile: '9422233374', mob2: '8422233374', aadh: aadhaar(52), pan: pan('SUNIP', 52), dob: '1991-06-26', pob: 'Raipur',             addr: '8 Shankar Nagar, Raipur 492007' },
  { firstName: 'Dhruv',    lastName: 'Aggarwal',    email: 'dhruv.a@example.com',        mobile: '8533344485', mob2: '',           aadh: aadhaar(53), pan: pan('DHRUA', 53), dob: '1999-09-09', pob: 'Noida',              addr: '44 Sector 18, Noida 201301' },
  { firstName: 'Sonam',    lastName: 'Bhatt',       email: 'sonam.bhatt@example.com',    mobile: '7644455596', mob2: '',           aadh: aadhaar(54), pan: pan('SONAM', 54), dob: '1994-03-03', pob: 'Udaipur',            addr: '29 Lake Palace Road, Udaipur 313001' },
  { firstName: 'Parth',    lastName: 'Gandhi',      email: 'parth.g@example.com',        mobile: '9755566707', mob2: '8755566707', aadh: aadhaar(55), pan: pan('PARTH', 55), dob: '2002-12-25', pob: 'Bhavnagar',          addr: '7 Kalanala, Bhavnagar 364001' },
  { firstName: 'Lavanya',  lastName: 'Subramaniam', email: 'lavanya.sub@example.com',    mobile: '8866677818', mob2: '',           aadh: aadhaar(56), pan: pan('LAVS', 56),  dob: '1996-08-08', pob: 'Salem',              addr: '15 Saradha College Road, Salem 636016' },
  { firstName: 'Ishaan',   lastName: 'Oberoi',      email: 'ishaan.o@example.com',       mobile: '9977788929', mob2: '',           aadh: aadhaar(57), pan: pan('ISHA0', 57), dob: '2000-01-01', pob: 'New Delhi',          addr: '88 Vasant Vihar, New Delhi 110057' },
  { firstName: 'Rekha',    lastName: 'Iyer',        email: 'rekha.iyer@example.com',     mobile: '7088899940', mob2: '9088899940', aadh: aadhaar(58), pan: pan('REKHI', 58), dob: '1987-05-15', pob: 'Tiruchirapalli',     addr: '3 Teppakulam, Trichy 620002' },
  { firstName: 'Shaurya',  lastName: 'Rawat',       email: 'shaurya.r@example.com',      mobile: '9199900051', mob2: '',           aadh: aadhaar(59), pan: pan('SHAUR', 59), dob: '2003-09-30', pob: 'Haridwar',           addr: '6 Rishikesh Road, Haridwar 249401' },
  { firstName: 'Nandita',  lastName: 'Ghosh',       email: 'nandita.g@example.com',      mobile: '8200011152', mob2: '',           aadh: aadhaar(60), pan: pan('NANDG', 60), dob: '1998-07-07', pob: 'Siliguri',           addr: '14 Sevoke Road, Siliguri 734001' },
  { firstName: 'Harshit',  lastName: 'Bansal',      email: 'harshit.b@example.com',      mobile: '9311122263', mob2: '8311122263', aadh: aadhaar(61), pan: pan('HARSH', 61), dob: '1993-11-20', pob: 'Agra',               addr: '40 Sadar Bazar, Agra 282001' },
  { firstName: 'Zara',     lastName: 'Khan',        email: 'zara.khan@example.com',      mobile: '7422233364', mob2: '',           aadh: aadhaar(62), pan: pan('ZARAK', 62), dob: '2001-06-14', pob: 'Hyderabad',          addr: '22 Jubilee Hills, Hyderabad 500033' },
  { firstName: 'Karthik',  lastName: 'Rajan',       email: 'karthik.r@example.com',      mobile: '9533344475', mob2: '',           aadh: aadhaar(63), pan: pan('KARTR', 63), dob: '1995-02-28', pob: 'Coimbatore',         addr: '9 Peelamedu, Coimbatore 641004' },
];

async function main() {
  console.log(`Seeding ${users.length} users...`);

  let created = 0, skipped = 0;

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        primaryMobile: u.mobile,
        secondaryMobile: u.mob2 || undefined,
        aadhaarNumber: u.aadh,
        panNumber: u.pan,
        dateOfBirth: new Date(u.dob),
        placeOfBirth: u.pob,
        currentAddress: u.addr,
        permanentAddress: u.addr,
      },
    });
    if (user.createdAt.getTime() === user.updatedAt.getTime()) { created++; } else { skipped++; }
    console.log(`  ✓ ${user.firstName} ${user.lastName}`);
  }

  console.log(`\nDone: ${created} created, ${skipped} already existed.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
