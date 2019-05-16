import React from 'react';
import PageTemplate from 'components/common/PageTemplate';
import ListWrapper from 'components/list/ListWrapper';
// import PostList from 'components/list/PostList';
// import Pagination from 'components/list/Pagination';
import ListContainer from 'containers/list/ListContainer';
import { Helmet } from 'react-helmet';

const ListPage = ({ match }) => {
    // page의 기본값을 1로 설정한다.
    const { page = 1, tag } = match.params;

    // title 값을 page값과 tag값에 따라 동적으로 설정한다.
    const title = (() => {
        let title = 'pbw React-blog';
        if (tag) {
            title += ` #${tag}`;
        }
        if (page !== 1) {
            title += ` - ${page}`;
        }
        return title;
    })();

    return (
        <PageTemplate>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ListWrapper>
                <ListContainer
                    page={parseInt(page, 10)}
                    tag={tag}
                />
            </ListWrapper>
        </PageTemplate>
    )
}

export default ListPage;