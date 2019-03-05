import * as _ from 'lodash';
import * as React from 'react';

import { styled } from '../../styles';

import { getHeaderDocs } from '../../model/http-docs';

import { CollapsibleSection } from '../common/collapsible-section';
import { ExchangeCollapsibleSummary, ExchangeCollapsibleBody } from './exchange-card';
import { DocsLink } from '../common/docs-link';

const HeadersGrid = styled.section`
    display: grid;
    grid-template-columns: 20px fit-content(30%) 1fr;

    grid-gap: 5px 0;
    &:not(:last-child) {
        margin-bottom: 10px;
    }
`;

const HeaderKeyValue = styled(ExchangeCollapsibleSummary)`
    word-break: break-all; /* Fallback for anybody without break-word */
    word-break: break-word;
    font-family: ${p => p.theme.monoFontFamily};
`;

const HeaderName = styled.span`
    margin-right: 10px;
`;

const HeaderDescription = styled(ExchangeCollapsibleBody)`
    line-height: 1.2;
`;

const HeaderDocsLink = styled(DocsLink)`
    display: block;
    margin-top: 10px;
`;

const EmptyState = styled.div`
    opacity: 0.5;
    font-style: italic;
`;

export const HeaderDetails = (props: { headers: { [key: string]: string | string[] } }) => {
    const headerNames = Object.keys(props.headers).sort();

    return headerNames.length === 0 ?
        <EmptyState>(None)</EmptyState>
    :
        <HeadersGrid>
            { _.flatMap(headerNames, (name) => {
                const headerValue = props.headers[name];
                if (typeof headerValue === 'string') {
                    return {
                        name,
                        value: headerValue,
                        key: name
                    };
                } else {
                    return headerValue.map((value, i) => ({
                        name,
                        value,
                        key: name + i
                    }));
                }
            }).map(({ name, value, key }) => {
                const docs = getHeaderDocs(name);

                return <CollapsibleSection withinGrid={true} key={key}>
                        <HeaderKeyValue>
                            <HeaderName>{ name }: </HeaderName>
                            <span>{ value }</span>
                        </HeaderKeyValue>

                        { docs && <HeaderDescription>
                            { docs.summary }
                            <HeaderDocsLink href={docs.url}>
                                Find out more
                            </HeaderDocsLink>
                        </HeaderDescription> }
                </CollapsibleSection>
            }) }
        </HeadersGrid>;
};