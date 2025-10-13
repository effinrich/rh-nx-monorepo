  WITH duplicatesWithId AS (
    select concat(cc.member_of_id::string, cc.company_conflicts_id::string) as id_joined, cc.id
    from company_conflicts cc
             inner join
         (    select member_of_id, company_conflicts_id
              from company_conflicts
              group by member_of_id, company_conflicts_id
              having count(*) > 1) T on T.member_of_id = cc.member_of_id
             and T.company_conflicts_id = cc.company_conflicts_id
    group by concat(cc.member_of_id::string, cc.company_conflicts_id::string), cc.id
)
delete from company_conflicts where id in(
  select id from duplicatesWithId where id not in (
    select  Min(id) from duplicatesWithId group by id_joined
  )
);
