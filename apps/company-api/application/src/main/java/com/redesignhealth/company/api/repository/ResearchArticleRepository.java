package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ResearchArticle;
import org.springframework.data.repository.CrudRepository;

public interface ResearchArticleRepository
    extends CrudRepository<ResearchArticle, Long>, RefRepository {}
