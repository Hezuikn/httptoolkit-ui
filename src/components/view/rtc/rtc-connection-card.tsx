import * as _ from 'lodash';
import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { UNKNOWN_SOURCE } from '../../../model/http/sources';
import { RTCConnection } from '../../../model/webrtc/rtc-connection';

import {
    CollapsibleCard,
    CollapsibleCardHeading
} from '../../common/card';
import {
    CollapsibleSection,
    CollapsibleSectionSummary,
    CollapsibleSectionBody
} from '../../common/collapsible-section';
import {
    ContentLabel,
    ContentMonoValueInline,
    ContentValue
} from '../../common/text-content';
import { SourceIcon } from '../../common/source-icon';
import { Pill } from '../../common/pill';
import { getSummaryColour } from '../../../model/events/categorization';

interface RTCConnectionCardProps {
    connection: RTCConnection;

    collapsed: boolean;
    expanded: boolean;
    onExpandToggled: () => void;
    onCollapseToggled?: () => void;
};

@observer
export class RTCConnectionCard extends React.Component<RTCConnectionCardProps> {

    @computed
    get hasData() {
        const { streams } = this.props.connection;
        return streams.some(s => s.isRTCDataChannel());
    }

    @computed
    get hasAudio() {
        const { streams } = this.props.connection;
        return streams.some(s =>
            s.isRTCMediaTrack() && s.type === 'audio'
        );
    }

    @computed
    get hasVideo() {
        const { streams } = this.props.connection;
        return streams.some(s =>
            s.isRTCMediaTrack() && s.type === 'video'
        );
    }

    render() {
        const { connection, ...cardProps } = this.props;

        return <CollapsibleCard {...cardProps}>
            <header>
                <SourceIcon source={connection.source} />

                { this.hasData &&
                    <Pill color={getSummaryColour('data')}>Data</Pill>
                }

                { this.hasVideo &&
                    <Pill color={getSummaryColour('image')}>Video</Pill>
                }

                { this.hasAudio &&
                    <Pill color={getSummaryColour('css')}>Audio</Pill>
                }

                <CollapsibleCardHeading onCollapseToggled={cardProps.onCollapseToggled}>
                    WebRTC Connection
                </CollapsibleCardHeading>
            </header>

            <CollapsibleSection>
                <CollapsibleSectionSummary>
                    <ContentLabel>Connection type: </ContentLabel>
                    <ContentValue>
                        {
                            connection.remoteCandidate.type === 'host'
                                ? 'Direct'
                            : connection.remoteCandidate.type === 'relay'
                                ? 'TURN-relayed'
                            : connection.remoteCandidate.type === 'srflx'
                                ? 'STUN-directed'
                            : // === prflx
                                'Peer-reflexive'
                        } {
                            connection.remoteCandidate.protocol.toUpperCase()
                        }
                    </ContentValue>
                </CollapsibleSectionSummary>
            </CollapsibleSection>

            <CollapsibleSection>
                <CollapsibleSectionSummary>
                    <ContentLabel>From: </ContentLabel>
                    <ContentMonoValueInline>{ connection.clientURL }</ContentMonoValueInline>
                </CollapsibleSectionSummary>
            </CollapsibleSection>

            <CollapsibleSection>
                <CollapsibleSectionSummary>
                    <ContentLabel>To: </ContentLabel>
                    <ContentMonoValueInline>{ connection.remoteURL }</ContentMonoValueInline>
                </CollapsibleSectionSummary>
            </CollapsibleSection>

            { connection.source !== UNKNOWN_SOURCE
                ? <CollapsibleSection>
                    <CollapsibleSectionSummary>
                        <ContentLabel>Client: </ContentLabel>
                        <ContentValue>{ connection.source.summary }</ContentValue>
                    </CollapsibleSectionSummary>

                    <CollapsibleSectionBody>
                        <p>{ connection.source.description }</p>
                    </CollapsibleSectionBody>
                </CollapsibleSection>
                : null
            }
        </CollapsibleCard>;
    }
}