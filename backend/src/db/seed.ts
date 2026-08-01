import { query } from './pool';

async function seed() {
  try {
    await query(`DELETE FROM diagnoses`);
    await query(`DELETE FROM reviews`);
    await query(`DELETE FROM payments`);
    await query(`DELETE FROM missions`);
    await query(`DELETE FROM subscriptions`);
    await query(`DELETE FROM garages`);
    await query(`DELETE FROM vehicles`);
    await query(`DELETE FROM professionals`);
    await query(`DELETE FROM users`);

    const usersRes = await query(`
      INSERT INTO users (phone, first_name, last_name, email, city) VALUES
        ('2250101010101', 'Jean', 'Kouame',   'jean.kouame@email.com',   'Abidjan, Cocody'),
        ('2250101010102', 'Marie', 'Diallo',   'marie.diallo@email.com',  'Abidjan, Plateau'),
        ('2250101010103', 'Paul',  'Aka',      'paul.aka@email.com',     'Abidjan, Yopougon'),
        ('2250101010104', 'Fatou',  'Sow',      'fatou.sow@email.com',    'Abidjan, Marcory'),
        ('2250101010105', 'David',  'Koffi',    'david.koffi@email.com',  'Abidjan, Treichville'),
        ('2250505050501', 'Admin',  'Mecanova',   'admin@mecanova.com',      'Abidjan, Cocody')
      RETURNING id, first_name, last_name
    `);
    const users = usersRes.rows;

    const mecanicienId = users[0].id;
    const remorqueurId = users[1].id;
    const client3Id = users[2].id;
    const client4Id = users[3].id;
    const client5Id = users[4].id;
    const adminId = users[5].id;

    const prosRes = await query(`
      INSERT INTO professionals (phone, type, first_name, last_name, business_name, specialties, city, zone_center_lat, zone_center_lng, zone_radius_km, is_available, status, rating, rating_count, mobile_money_number, hours) VALUES
        ('2250707070701', 'mechanic',  'Kouame',   'Frederic', 'Garage Central Auto',   ARRAY['Moteur', 'Batterie', 'Freins'],            'Abidjan, Cocody',     5.345, -4.015, 10, true,  'active', 4.8, 45,  '2250707070701', '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-18:00","fri":"08:00-18:00","sat":"09:00-14:00","sun":"closed"}'),
        ('2250707070702', 'tow_truck', 'Diallo',   'Moussa',   'Remorquage Express',    ARRAY['Remorquage', 'Depannage'],                  'Abidjan, Plateau',    5.332, -4.020, 15, true,  'active', 4.5, 28,  '2250707070702', '{"mon":"00:00-24:00","tue":"00:00-24:00","wed":"00:00-24:00","thu":"00:00-24:00","fri":"00:00-24:00","sat":"00:00-24:00","sun":"00:00-24:00"}'),
        ('2250707070703', 'garage',    'Koffi',    'Emmanuel', 'Garage Freres Koffi',   ARRAY['Carrosserie', 'Peinture', 'Mecanique generale'], 'Abidjan, Yopougon', 5.348, -4.080, 8,  true,  'active', 4.9, 62,  '2250707070703', '{"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-20:00","sat":"08:00-18:00","sun":"10:00-14:00"}'),
        ('2250707070704', 'mechanic',  'Traore',   'Souleymane','Auto Plus Abidjan',    ARRAY['Climatisation', 'Electronique', 'Diagnostic'],'Abidjan, Marcory',    5.320, -3.990, 10, false, 'active', 3.5, 15,  '2250707070704', '{"mon":"08:00-17:00","tue":"08:00-17:00","wed":"08:00-17:00","thu":"08:00-17:00","fri":"08:00-17:00","sat":"09:00-13:00","sun":"closed"}'),
        ('2250707070705', 'tow_truck', 'Nguessan', 'Benoit',   'Remorquage Abidjan Nord', ARRAY['Remorquage', 'Depannage electrique'],      'Abidjan, Treichville',5.310, -4.000, 12, false, 'active', 4.2, 10,  '2250707070705', '{"mon":"06:00-22:00","tue":"06:00-22:00","wed":"06:00-22:00","thu":"06:00-22:00","fri":"06:00-22:00","sat":"06:00-22:00","sun":"08:00-18:00"}'),
        ('2250707070706', 'garage',    'Bamba',    'Adama',    'Garage Bamba Auto',    ARRAY['Moteur', 'Boite de vitesse', 'Embrayage'],    'Abidjan, Cocody',    5.338, -4.008, 10, true,  'active', 4.6, 33,  '2250707070706', '{"mon":"07:30-18:30","tue":"07:30-18:30","wed":"07:30-18:30","thu":"07:30-18:30","fri":"07:30-18:30","sat":"08:00-15:00","sun":"closed"}'),
        ('2250707070707', 'mechanic',  'Oulai',    'Sylvain',  NULL,                   ARRAY['Depannage mobile', 'Batterie', 'Pneus'],    'Abidjan, Abobo',      5.370, -4.040, 5,  true,  'active', 4.3, 20,  '2250707070707', '{"mon":"07:00-19:00","tue":"07:00-19:00","wed":"07:00-19:00","thu":"07:00-19:00","fri":"07:00-19:00","sat":"07:00-15:00","sun":"09:00-13:00"}'),
        ('2250707070708', 'mechanic',  'Konan',    'Arnaud',   'Konan Mecanique Mobile',ARRAY['Depannage mobile', 'Vidange', 'Plaquettes'],'Abidjan, Adjame',     5.358, -4.027, 6,  false, 'pending', 0,   0,   '2250707070708', '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-18:00","fri":"08:00-18:00","sat":"09:00-14:00","sun":"closed"}')
      RETURNING id
    `);
    const pros = prosRes.rows;

    const vehiclesRes = await query(`
      INSERT INTO vehicles (user_id, brand, model, year, license_plate) VALUES
        ($1, 'Toyota',  'Corolla',   2019, 'AB-123-CD'),
        ($1, 'Honda',   'Civic',     2020, 'EF-456-GH'),
        ($2, 'Mercedes','Classe A',  2021, 'IJ-789-KL'),
        ($3, 'Renault', 'Clio',      2018, 'MN-012-OP'),
        ($4, 'Peugeot', '3008',      2022, 'QR-345-ST')
    `, [mecanicienId, remorqueurId, client3Id, client4Id] as any);

    await query(`
      INSERT INTO missions (user_id, professional_id, service_type, description, location_address, status, location_lat, location_lng) VALUES
        ($1, $2, 'mechanic',  'Batterie à remplacer',    'Cocody Angré',             'completed',    5.345, -4.015),
        ($1, $2, 'mechanic',  'Vidange + filtre à huile','Cocody Riviera',           'in_progress',  5.350, -4.010),
        ($4, $2, 'mechanic',  'Diagnostic moteur',       'Marcory Zone 4',           'pending',      5.320, -3.990),
        ($1, $3, 'tow_truck', 'Panne sur autoroute',     'Autoroute du Nord, PK 12', 'completed',    5.400, -4.050),
        ($5, $3, 'tow_truck', 'Accident léger',          'Treichville Carrefour',    'cancelled',    5.310, -4.000),
        ($2, $3, 'tow_truck', 'Véhicule en panne',       'Plateau',                  'completed',    5.330, -4.020),
        ($1, $5, 'garage',    'Révision complète',       'Cocody Angré',             'pending',      5.345, -4.015)
    `, []);

    await query(`
      INSERT INTO diagnoses (mission_id, professional_id, description, amount, status) VALUES
        ($1, $2, 'Batterie HS - remplacement nécessaire', 65000,  'accepted'),
        ($2, $2, 'Huile moteur + filtre à changer',       25000,  'pending'),
        ($4, $3, 'Courroie de distribution cassée',       120000, 'accepted')
    `, []);

    const garagesRes = await query(`
      INSERT INTO garages (professional_id, name, address, lat, lng, phone, specialties, hours, indicative_prices) VALUES
        ($1, 'Garage Central Auto',    'Cocody, Angré, Rue des Jardins',       5.345, -4.015, '2250707070701', ARRAY['Moteur', 'Batterie', 'Freins'],             '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-18:00","fri":"08:00-18:00","sat":"09:00-14:00"}',   '{"diagnostic":"5 000-10 000","vidange":"15 000-25 000","freins":"10 000-20 000"}'),
        ($2, 'Garage Freres Koffi',    'Yopougon, Sicogi, Rue Principale',     5.348, -4.080, '2250707070703', ARRAY['Carrosserie', 'Peinture', 'Mecanique generale'], '{"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-20:00","sat":"08:00-18:00"}', '{"carrosserie":"50 000-150 000","peinture":"75 000-200 000","mecanique":"15 000-50 000"}'),
        ($3, 'Auto Plus Abidjan',      'Marcory, Zone 4, Boulevard de Marseille',5.320, -3.990, '2250707070704', ARRAY['Climatisation', 'Electronique', 'Diagnostic'],'{"mon":"08:00-17:00","tue":"08:00-17:00","wed":"08:00-17:00","thu":"08:00-17:00","fri":"08:00-17:00","sat":"09:00-13:00"}',  '{"diagnostic":"7 000-12 000","clim":"20 000-40 000"}'),
        ($4, 'Garage Bamba Auto',      'Cocody, Riviera III, Rue des Palmiers',5.338, -4.008, '2250707070706', ARRAY['Moteur', 'Boite de vitesse', 'Embrayage'],    '{"mon":"07:30-18:30","tue":"07:30-18:30","wed":"07:30-18:30","thu":"07:30-18:30","fri":"07:30-18:30","sat":"08:00-15:00"}',  '{"embrayage":"100 000-200 000","moteur":"50 000-150 000"}')
      RETURNING id
    `, [pros[0].id, pros[2].id, pros[3].id, pros[5].id]);

    console.log(`[seed] ${users.length} users, ${pros.length} pros, ${garagesRes.rows.length} garages`);
  } catch (err) {
    console.error('[seed] Error:', err);
  }
}

export { seed };
export default seed;
