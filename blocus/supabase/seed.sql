-- =============================================================================
-- Blocus - Seed Data
-- =============================================================================
-- This script creates sample data for development and testing.
-- Run via Supabase SQL Editor or `supabase db reset` command.
-- =============================================================================

-- Clear existing data (in reverse order of dependencies)
DELETE FROM boulder_photos;
DELETE FROM boulders;
DELETE FROM walls;
DELETE FROM gyms;

-- =============================================================================
-- GYMS (3 salles d'escalade a Paris)
-- =============================================================================

INSERT INTO gyms (id, name, address, latitude, longitude, description)
VALUES
  -- Gym 1: Bloc Session Paris (Bastille area)
  (
    '11111111-1111-1111-1111-111111111111',
    'Bloc Session Paris',
    '123 Rue de la Roquette, 75011 Paris',
    48.8566,
    2.3780,
    'Salle de bloc moderne avec 500m2 de surface grimpable. Ouverture tous les mardis.'
  ),
  -- Gym 2: Arkose Nation (Nation area)
  (
    '22222222-2222-2222-2222-222222222222',
    'Arkose Nation',
    '45 Boulevard de Charonne, 75020 Paris',
    48.8534,
    2.3957,
    'Grande salle avec espaces debutants et confirmes. Bar et espace detente.'
  ),
  -- Gym 3: Climb Up Pantin (Pantin)
  (
    '33333333-3333-3333-3333-333333333333',
    'Climb Up Pantin',
    '12 Rue Cartier Bresson, 93500 Pantin',
    48.8965,
    2.4123,
    'Plus grande salle d''escalade d''Ile-de-France. Bloc et voie.'
  );

-- =============================================================================
-- WALLS - Gym 1: Bloc Session Paris (5 murs)
-- =============================================================================

INSERT INTO walls (id, gym_id, name, description, order_index)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Devers',
    'Mur en devers 30 degres, ideal pour travailler la resistance',
    0
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Dalle',
    'Mur en dalle technique, travail d''equilibre et de pieds',
    1
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Toit',
    'Section toit horizontal, force et gainage requis',
    2
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Vertical',
    'Mur vertical classique, toutes techniques',
    3
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Competition',
    'Mur de competition avec prises variees',
    4
  );

-- =============================================================================
-- WALLS - Gym 2: Arkose Nation (4 murs)
-- =============================================================================

INSERT INTO walls (id, gym_id, name, description, order_index)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Espace Debutant',
    'Murs accessibles pour les nouveaux grimpeurs',
    0
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Devers Moyen',
    'Devers intermediaire, bonne progression',
    1
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Devers Fort',
    'Devers prononce pour grimpeurs confirmes',
    2
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'Moon Board',
    'Moon Board 2019 pour entrainement',
    3
  );

-- =============================================================================
-- WALLS - Gym 3: Climb Up Pantin (3 murs)
-- =============================================================================

INSERT INTO walls (id, gym_id, name, description, order_index)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Bloc Principal',
    'Zone de bloc principale avec renouvellement hebdomadaire',
    0
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Espace Enfants',
    'Zone adaptee aux enfants de 4 a 12 ans',
    1
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'Training Zone',
    'Pan Gullich, poutre et campus board',
    2
  );

-- =============================================================================
-- BOULDERS - Gym 1, Wall 1: Devers (8 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  -- Easy (difficulty 1-3)
  (
    'd1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Premier Pas',
    'Bloc d''initiation avec de grosses prises. Parfait pour debuter.',
    2
  ),
  (
    'd1111111-1111-1111-1111-111111111112',
    'a1111111-1111-1111-1111-111111111111',
    'La Traversee Facile',
    'Traversee horizontale avec prises juggy.',
    3
  ),
  -- Medium (difficulty 4-6)
  (
    'd1111111-1111-1111-1111-111111111113',
    'a1111111-1111-1111-1111-111111111111',
    'Le Pilier Rouge',
    'Demarrage dynamique puis retablissement technique. Attention au retour.',
    5
  ),
  (
    'd1111111-1111-1111-1111-111111111114',
    'a1111111-1111-1111-1111-111111111111',
    'Compression Bleue',
    'Mouvement de compression sur volumes. Lire la sequence avant de partir.',
    6
  ),
  (
    'd1111111-1111-1111-1111-111111111115',
    'a1111111-1111-1111-1111-111111111111',
    'L''Arete Technique',
    NULL,
    4
  ),
  -- Hard (difficulty 7-8)
  (
    'd1111111-1111-1111-1111-111111111116',
    'a1111111-1111-1111-1111-111111111111',
    'Resistance Extreme',
    'Longue sequence en devers. Gestion de l''effort primordiale. Compter au moins 15 mouvements avant le repos.',
    7
  ),
  (
    'd1111111-1111-1111-1111-111111111117',
    'a1111111-1111-1111-1111-111111111111',
    'Le Crux Final',
    'Bloc court mais intense. Crux au milieu sur mono-doigt.',
    8
  ),
  -- Expert (difficulty 9-10)
  (
    'd1111111-1111-1111-1111-111111111118',
    'a1111111-1111-1111-1111-111111111111',
    'Projet du Mois',
    'Le bloc le plus dur de la salle. Coordination parfaite requise. Ouverture par Adam Ondra lors de sa visite.',
    9
  );

-- =============================================================================
-- BOULDERS - Gym 1, Wall 2: Dalle (6 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'd2111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    'Equilibre',
    'Travail d''equilibre sur micro-prises.',
    3
  ),
  (
    'd2111111-1111-1111-1111-111111111112',
    'a2222222-2222-2222-2222-222222222222',
    'Friction Master',
    'Adherence sur graton. Chaussons precis obligatoires.',
    5
  ),
  (
    'd2111111-1111-1111-1111-111111111113',
    'a2222222-2222-2222-2222-222222222222',
    'Le Diedre',
    NULL,
    4
  ),
  (
    'd2111111-1111-1111-1111-111111111114',
    'a2222222-2222-2222-2222-222222222222',
    'Micro Pieds',
    'Sequence technique sur gratonnage fin.',
    7
  ),
  (
    'd2111111-1111-1111-1111-111111111115',
    'a2222222-2222-2222-2222-222222222222',
    'Le Vertical Parfait',
    'Bloc technique pure. Pas de force, juste du placement.',
    6
  ),
  (
    'd2111111-1111-1111-1111-111111111116',
    'a2222222-2222-2222-2222-222222222222',
    'Dalle Extreme',
    'Le classique de la salle. Nombreuses methodes possibles.',
    8
  );

-- =============================================================================
-- BOULDERS - Gym 1, Wall 3: Toit (5 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'd3111111-1111-1111-1111-111111111111',
    'a3333333-3333-3333-3333-333333333333',
    'Premier Toit',
    'Introduction au toit avec bacs genereux.',
    4
  ),
  (
    'd3111111-1111-1111-1111-111111111112',
    'a3333333-3333-3333-3333-333333333333',
    'Gainage Central',
    'Travail de gainage sur prises rondes.',
    6
  ),
  (
    'd3111111-1111-1111-1111-111111111113',
    'a3333333-3333-3333-3333-333333333333',
    'Heel Hook Party',
    'Utilisation intensive des talons. Souplesse requise.',
    7
  ),
  (
    'd3111111-1111-1111-1111-111111111114',
    'a3333333-3333-3333-3333-333333333333',
    'Le Retablissement',
    NULL,
    8
  ),
  (
    'd3111111-1111-1111-1111-111111111115',
    'a3333333-3333-3333-3333-333333333333',
    'Toit Integral',
    'Traversee complete du toit. Reserve aux experts.',
    10
  );

-- =============================================================================
-- BOULDERS - Gym 2, Wall 1: Espace Debutant (6 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111',
    'Mon Premier Bloc',
    'Bloc ideal pour une premiere experience d''escalade.',
    1
  ),
  (
    'e1111111-1111-1111-1111-111111111112',
    'b1111111-1111-1111-1111-111111111111',
    'Les Grosses Prises',
    'Enchainement de bacs pour apprendre les mouvements de base.',
    1
  ),
  (
    'e1111111-1111-1111-1111-111111111113',
    'b1111111-1111-1111-1111-111111111111',
    'Petit Devers',
    'Introduction au devers leger.',
    2
  ),
  (
    'e1111111-1111-1111-1111-111111111114',
    'b1111111-1111-1111-1111-111111111111',
    'Le Mur Arc-en-ciel',
    'Bloc colore avec prises faciles a identifier.',
    2
  ),
  (
    'e1111111-1111-1111-1111-111111111115',
    'b1111111-1111-1111-1111-111111111111',
    'Progression',
    'Un cran au dessus pour evoluer.',
    3
  ),
  (
    'e1111111-1111-1111-1111-111111111116',
    'b1111111-1111-1111-1111-111111111111',
    'Le Defi Debutant',
    NULL,
    3
  );

-- =============================================================================
-- BOULDERS - Gym 2, Wall 2: Devers Moyen (5 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'e2111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    'Continuity',
    'Bloc de continuite avec nombreuses prises.',
    4
  ),
  (
    'e2111111-1111-1111-1111-111111111112',
    'b2222222-2222-2222-2222-222222222222',
    'Le Tombant',
    'Passage engage avec retablissement.',
    5
  ),
  (
    'e2111111-1111-1111-1111-111111111113',
    'b2222222-2222-2222-2222-222222222222',
    'Volume Game',
    'Bloc sur volumes, lecture importante.',
    5
  ),
  (
    'e2111111-1111-1111-1111-111111111114',
    'b2222222-2222-2222-2222-222222222222',
    'La Diagonale',
    'Traversee diagonale technique.',
    6
  ),
  (
    'e2111111-1111-1111-1111-111111111115',
    'b2222222-2222-2222-2222-222222222222',
    'Compression Time',
    NULL,
    6
  );

-- =============================================================================
-- BOULDERS - Gym 2, Wall 3: Devers Fort (5 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'e3111111-1111-1111-1111-111111111111',
    'b3333333-3333-3333-3333-333333333333',
    'Power Start',
    'Demarrage explosif sur reglettes.',
    7
  ),
  (
    'e3111111-1111-1111-1111-111111111112',
    'b3333333-3333-3333-3333-333333333333',
    'Le Mur de la Souffrance',
    'Resistance sur prises moyennes. Mental d''acier requis.',
    7
  ),
  (
    'e3111111-1111-1111-1111-111111111113',
    'b3333333-3333-3333-3333-333333333333',
    'Dynamique Extreme',
    'Enchainement de mouvements dynamiques.',
    8
  ),
  (
    'e3111111-1111-1111-1111-111111111114',
    'b3333333-3333-3333-3333-333333333333',
    'Le Jeté',
    'Mouvement iconique de la salle. Coordination parfaite.',
    8
  ),
  (
    'e3111111-1111-1111-1111-111111111115',
    'b3333333-3333-3333-3333-333333333333',
    'Arkose Master',
    'Le bloc signature. Reserve a l''elite.',
    9
  );

-- =============================================================================
-- BOULDERS - Gym 3, Wall 1: Bloc Principal (7 boulders)
-- =============================================================================

INSERT INTO boulders (id, wall_id, title, description, difficulty)
VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Nouveaute Semaine',
    'Ouverture de la semaine. A decouvrir!',
    4
  ),
  (
    'f1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111111',
    'Le Classique',
    'Un incontournable de la salle.',
    5
  ),
  (
    'f1111111-1111-1111-1111-111111111113',
    'c1111111-1111-1111-1111-111111111111',
    'Coordination',
    'Bloc de coordination sur prises variees.',
    5
  ),
  (
    'f1111111-1111-1111-1111-111111111114',
    'c1111111-1111-1111-1111-111111111111',
    'Le Morpho',
    NULL,
    6
  ),
  (
    'f1111111-1111-1111-1111-111111111115',
    'c1111111-1111-1111-1111-111111111111',
    'Tech Session',
    'Bloc technique avec lecture obligatoire.',
    6
  ),
  (
    'f1111111-1111-1111-1111-111111111116',
    'c1111111-1111-1111-1111-111111111111',
    'Power Move',
    'Force et explosivite.',
    7
  ),
  (
    'f1111111-1111-1111-1111-111111111117',
    'c1111111-1111-1111-1111-111111111111',
    'Le Projet',
    'En cours de validation par les ouvreurs.',
    9
  );

-- =============================================================================
-- BOULDER_PHOTOS - Adding photos to boulders
-- Using picsum.photos for placeholder images
-- =============================================================================

-- Gym 1, Wall 1 (Devers) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  -- Premier Pas (2 photos)
  (
    '01111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-premier-pas-1/400/300',
    0
  ),
  (
    '01111111-1111-1111-1111-111111111112',
    'd1111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-premier-pas-2/400/300',
    1
  ),
  -- La Traversee Facile (1 photo)
  (
    '01111111-1111-1111-1111-111111111113',
    'd1111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-traversee-facile/400/300',
    0
  ),
  -- Le Pilier Rouge (2 photos)
  (
    '01111111-1111-1111-1111-111111111114',
    'd1111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-pilier-rouge-1/400/300',
    0
  ),
  (
    '01111111-1111-1111-1111-111111111115',
    'd1111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-pilier-rouge-2/400/300',
    1
  ),
  -- Compression Bleue (1 photo)
  (
    '01111111-1111-1111-1111-111111111116',
    'd1111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-compression-bleue/400/300',
    0
  ),
  -- L'Arete Technique (1 photo)
  (
    '01111111-1111-1111-1111-111111111117',
    'd1111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-arete-technique/400/300',
    0
  ),
  -- Resistance Extreme (2 photos)
  (
    '01111111-1111-1111-1111-111111111118',
    'd1111111-1111-1111-1111-111111111116',
    'https://picsum.photos/seed/bloc-resistance-1/400/300',
    0
  ),
  (
    '01111111-1111-1111-1111-111111111119',
    'd1111111-1111-1111-1111-111111111116',
    'https://picsum.photos/seed/bloc-resistance-2/400/300',
    1
  ),
  -- Le Crux Final (1 photo)
  (
    '01111111-1111-1111-1111-11111111111a',
    'd1111111-1111-1111-1111-111111111117',
    'https://picsum.photos/seed/bloc-crux-final/400/300',
    0
  ),
  -- Projet du Mois (2 photos)
  (
    '01111111-1111-1111-1111-11111111111b',
    'd1111111-1111-1111-1111-111111111118',
    'https://picsum.photos/seed/bloc-projet-mois-1/400/300',
    0
  ),
  (
    '01111111-1111-1111-1111-11111111111c',
    'd1111111-1111-1111-1111-111111111118',
    'https://picsum.photos/seed/bloc-projet-mois-2/400/300',
    1
  );

-- Gym 1, Wall 2 (Dalle) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '02111111-1111-1111-1111-111111111111',
    'd2111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-equilibre/400/300',
    0
  ),
  (
    '02111111-1111-1111-1111-111111111112',
    'd2111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-friction-master/400/300',
    0
  ),
  (
    '02111111-1111-1111-1111-111111111113',
    'd2111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-diedre/400/300',
    0
  ),
  (
    '02111111-1111-1111-1111-111111111114',
    'd2111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-micro-pieds/400/300',
    0
  ),
  (
    '02111111-1111-1111-1111-111111111115',
    'd2111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-vertical-parfait/400/300',
    0
  ),
  (
    '02111111-1111-1111-1111-111111111116',
    'd2111111-1111-1111-1111-111111111116',
    'https://picsum.photos/seed/bloc-dalle-extreme/400/300',
    0
  );

-- Gym 1, Wall 3 (Toit) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '03111111-1111-1111-1111-111111111111',
    'd3111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-premier-toit/400/300',
    0
  ),
  (
    '03111111-1111-1111-1111-111111111112',
    'd3111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-gainage-central/400/300',
    0
  ),
  (
    '03111111-1111-1111-1111-111111111113',
    'd3111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-heel-hook/400/300',
    0
  ),
  (
    '03111111-1111-1111-1111-111111111114',
    'd3111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-retablissement/400/300',
    0
  ),
  (
    '03111111-1111-1111-1111-111111111115',
    'd3111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-toit-integral/400/300',
    0
  );

-- Gym 2, Wall 1 (Espace Debutant) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '0e111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-mon-premier/400/300',
    0
  ),
  (
    '0e111111-1111-1111-1111-111111111112',
    'e1111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-grosses-prises/400/300',
    0
  ),
  (
    '0e111111-1111-1111-1111-111111111113',
    'e1111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-petit-devers/400/300',
    0
  ),
  (
    '0e111111-1111-1111-1111-111111111114',
    'e1111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-arc-en-ciel/400/300',
    0
  ),
  (
    '0e111111-1111-1111-1111-111111111115',
    'e1111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-progression/400/300',
    0
  ),
  (
    '0e111111-1111-1111-1111-111111111116',
    'e1111111-1111-1111-1111-111111111116',
    'https://picsum.photos/seed/bloc-defi-debutant/400/300',
    0
  );

-- Gym 2, Wall 2 (Devers Moyen) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '0e211111-1111-1111-1111-111111111111',
    'e2111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-continuity/400/300',
    0
  ),
  (
    '0e211111-1111-1111-1111-111111111112',
    'e2111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-tombant/400/300',
    0
  ),
  (
    '0e211111-1111-1111-1111-111111111113',
    'e2111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-volume-game/400/300',
    0
  ),
  (
    '0e211111-1111-1111-1111-111111111114',
    'e2111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-diagonale/400/300',
    0
  ),
  (
    '0e211111-1111-1111-1111-111111111115',
    'e2111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-compression-time/400/300',
    0
  );

-- Gym 2, Wall 3 (Devers Fort) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '0e311111-1111-1111-1111-111111111111',
    'e3111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-power-start/400/300',
    0
  ),
  (
    '0e311111-1111-1111-1111-111111111112',
    'e3111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-mur-souffrance/400/300',
    0
  ),
  (
    '0e311111-1111-1111-1111-111111111113',
    'e3111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-dynamique-extreme/400/300',
    0
  ),
  (
    '0e311111-1111-1111-1111-111111111114',
    'e3111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-jete/400/300',
    0
  ),
  (
    '0e311111-1111-1111-1111-111111111115',
    'e3111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-arkose-master/400/300',
    0
  );

-- Gym 3, Wall 1 (Bloc Principal) photos
INSERT INTO boulder_photos (id, boulder_id, url, order_index)
VALUES
  (
    '0f111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111',
    'https://picsum.photos/seed/bloc-nouveaute/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111112',
    'f1111111-1111-1111-1111-111111111112',
    'https://picsum.photos/seed/bloc-classique/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111113',
    'f1111111-1111-1111-1111-111111111113',
    'https://picsum.photos/seed/bloc-coordination/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111114',
    'f1111111-1111-1111-1111-111111111114',
    'https://picsum.photos/seed/bloc-morpho/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111115',
    'f1111111-1111-1111-1111-111111111115',
    'https://picsum.photos/seed/bloc-tech-session/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111116',
    'f1111111-1111-1111-1111-111111111116',
    'https://picsum.photos/seed/bloc-power-move/400/300',
    0
  ),
  (
    '0f111111-1111-1111-1111-111111111117',
    'f1111111-1111-1111-1111-111111111117',
    'https://picsum.photos/seed/bloc-projet/400/300',
    0
  );

-- =============================================================================
-- Verification queries (uncomment to test)
-- =============================================================================
-- SELECT COUNT(*) as gym_count FROM gyms;
-- SELECT COUNT(*) as wall_count FROM walls;
-- SELECT COUNT(*) as boulder_count FROM boulders;
-- SELECT COUNT(*) as photo_count FROM boulder_photos;
-- SELECT g.name, COUNT(w.id) as wall_count FROM gyms g LEFT JOIN walls w ON w.gym_id = g.id GROUP BY g.name;
-- SELECT difficulty, COUNT(*) FROM boulders GROUP BY difficulty ORDER BY difficulty;
