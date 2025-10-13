UPDATE ip_marketplace set legal_patentability_assessment_available = false where legal_patentability_assessment_available IS NULL;
UPDATE ip_marketplace set copyrighted = false where copyrighted IS NULL;
