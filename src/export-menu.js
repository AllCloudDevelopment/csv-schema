import React from 'react'
import Knex from 'knex'

import slugify from 'slugify'

class ExportMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = { exportType: 'Salesforce Metadata XML' }
    }

    get exportTypes() {
        return {
            'Salesforce Metadata XML': this.exportSfdcMetadata.bind(this),
            'JSON Table Schema': this.exportJSONTableSchema.bind(this)
        }
    }

    render() {
        const enabledFields = this.props.fields.filter((field) => field.enabled)
        const exportResult = this.exportTypes[this.state.exportType](enabledFields)
        const tabs = []
        for (let type in this.exportTypes) {
            tabs.push(( <
                li key = { type }
                className = { this.state.exportType === type ? 'active' : '' } >
                <
                a href = '#'
                onClick = { this.setExportType.bind(this, type) } > { type } < /a> < /
                li >
            ))
        }

        return ( <
            div >
            <
            ul className = 'nav nav-tabs' > { tabs } <
            /ul> <
            div className = 'export-result' > < 
            pre> { exportResult } < /pre> < /div> < /
            div >
        )
    }

    setExportType(exportType, event) {
        this.setState({ exportType })
        event.preventDefault()
    }

    exportJSONTableSchema(fields) {
        const typeMap = {
            float: 'number',
            text: 'string'
        }
        const jtsFields = fields.map((field) => {
            const fieldType = typeMap[field.type] || field.type
            const jtsField = {
                name: field.machineName,
                type: fieldType,
                constraints: {
                    required: !field.nullable
                }
            }
            if (fieldType === 'Text') {
                jtsField.constraints.maxLength = field.maxLength
            }
            return jtsField
        })
        return JSON.stringify({ fields: jtsFields }, null, 2)
    }

    exportSfdcMetadata(fields) {
        const typeMap = {
            float: 'number',
            text: 'string'
        }
        let body = `
        <CustomObject xmlns='http://soap.sforce.com/2006/04/metadata'>
            <actionOverrides>
                <actionName>Accept</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Accept</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Accept</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>CancelEdit</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>CancelEdit</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>CancelEdit</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Clone</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Clone</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Clone</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Delete</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Delete</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Delete</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Edit</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Edit</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Edit</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>List</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>List</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>List</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>New</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>New</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>New</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>SaveEdit</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>SaveEdit</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>SaveEdit</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Tab</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Tab</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>Tab</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>View</actionName>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>View</actionName>
                <formFactor>Large</formFactor>
                <type>Default</type>
            </actionOverrides>
            <actionOverrides>
                <actionName>View</actionName>
                <formFactor>Small</formFactor>
                <type>Default</type>
            </actionOverrides>
            <allowInChatterGroups>false</allowInChatterGroups>
            <compactLayoutAssignment>SYSTEM</compactLayoutAssignment>
            <deploymentStatus>Deployed</deploymentStatus>
            <enableActivities>true</enableActivities>
            <enableBulkApi>true</enableBulkApi>
            <enableFeeds>false</enableFeeds>
            <enableHistory>true</enableHistory>
            <enableLicensing>false</enableLicensing>
            <enableReports>true</enableReports>
            <enableSearch>true</enableSearch>
            <enableSharing>true</enableSharing>
            <enableStreamingApi>true</enableStreamingApi>
            <externalSharingModel>Private</externalSharingModel>`

        const fieldify = function(s) {
            return slugify(s.replace('__c', ''), '_')
                .split('_').map((el) => el.substr(0, 1).toUpperCase() + el.substr(1).toLowerCase())
                .join('_') + '__c';
        },
        labelify = function(s) {
            return slugify(s.replace('__c', ''), '_')
                .split('_').map((el) => el.substr(0, 1).toUpperCase() + el.substr(1).toLowerCase())
                .join(' ');
        }

        fields.map((field)=>{
            const fieldType = typeMap[field.type] || field.type
            const jtsField = `<fields>
                <fullName>${fieldify(field.machineName)}</fullName>
                <externalId>false</externalId>
                <label>${labelify(field.machineName)}</label>
                <required>false</required>
                <trackHistory>false</trackHistory>
                <trackTrending>false</trackTrending>
                <type>${fieldType}</type>
            </fields>
            `
            if (fieldType === 'Text') {
                //jtsField.constraints.maxLength = field.maxLength
            }
            return jtsField
        }).forEach((e)=>body+=e)

        body += `
        <label>${labelify(this.props.file.name)}</label>
        <listViews>
            <fullName>All</fullName>
            <columns>NAME</columns>
            <columns>External_ID__c</columns>
            <columns>Start_Date__c</columns>
            <columns>End_Date__c</columns>
            <columns>Current_Campaign__c</columns>
            <columns>Last_Campaign__c</columns>
            <filterScope>Everything</filterScope>
            <label>All</label>
        </listViews>
        <nameField>
            <label>${labelify(this.props.file.name)} Name</label>
            <trackHistory>false</trackHistory>
            <type>Text</type>
        </nameField>
        <pluralLabel>${labelify(this.props.file.name)}s</pluralLabel>
        <searchLayouts>
            <searchResultsAdditionalFields>Start_Date__c</searchResultsAdditionalFields>
            <searchResultsAdditionalFields>End_Date__c</searchResultsAdditionalFields>
            <searchResultsAdditionalFields>Current_Campaign__c</searchResultsAdditionalFields>
            <searchResultsAdditionalFields>Last_Campaign__c</searchResultsAdditionalFields>
        </searchLayouts>
        <sharingModel>Read</sharingModel>
        <startsWith>Vowel</startsWith>
        <visibility>Public</visibility>
    <` + '/CustomObject>'

        return body
    }
}

ExportMenu.propTypes = {
    file: React.PropTypes.object,
    fields: React.PropTypes.array
}

export default ExportMenu