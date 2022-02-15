package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QConference is a Querydsl query type for Conference
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QConference extends EntityPathBase<Conference> {

    private static final long serialVersionUID = -625543586L;

    public static final QConference conference = new QConference("conference");

    public final BooleanPath active = createBoolean("active");

    public final StringPath description = createString("description");

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    public final StringPath title = createString("title");

    public final ListPath<User, QUser> users = this.<User, QUser>createList("users", User.class, QUser.class, PathInits.DIRECT2);

    public QConference(String variable) {
        super(Conference.class, forVariable(variable));
    }

    public QConference(Path<? extends Conference> path) {
        super(path.getType(), path.getMetadata());
    }

    public QConference(PathMetadata metadata) {
        super(Conference.class, metadata);
    }

}

