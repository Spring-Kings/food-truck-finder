package food.truck.api.search;

import food.truck.api.truck.Truck;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.apache.lucene.search.Query;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.FullTextQuery;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.util.List;

@Component
@Log4j
@RequiredArgsConstructor
public class TruckSearchService {

    private final EntityManager entityManager;

    public List<Truck> getTruckBaseOnText(String text){
        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);

        QueryBuilder qb = fullTextEntityManager
                .getSearchFactory()
                .buildQueryBuilder()
                .forEntity(Truck.class)
                .get();

        Query truckQuery = qb.keyword()
                .fuzzy().withEditDistanceUpTo(2)
                .onFields("name", "description", "tags") // TODO: Search in tags, as well
                .matching(text)
                .createQuery();

        FullTextQuery fullTextQuery = fullTextEntityManager.createFullTextQuery(truckQuery, Truck.class);

        return (List<Truck>)fullTextQuery.getResultList();
    }

}
