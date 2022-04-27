({
	init: function(cmp, event, helper) {
        helper.setColumns(cmp);
        helper.setData(cmp);
    },

    handleSort: function(cmp, event, helper) {
        helper.handleSort(cmp, event);
    },
    
    handleKeyUp: function (cmp, evt) {
        var isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            var queryTerm = cmp.find('enter-search').get('v.value');
            //alert('Searched for "' + queryTerm + '"!');
            
            var action = cmp.get('c.getFinancialAccountsFilter');
            console.log('queryTerm:',queryTerm);
            action.setParams({
                'searchKey' : queryTerm
            });
            action.setCallback(this, function(a){
                var state = a.getState();
                if(state == 'SUCCESS') {
                    var rows = a.getReturnValue();
                    for ( var i = 0; i < rows.length; i++ ) {
                        var row = rows[i];
                        if ( row.Owner ) {
                            row.OwnerName = row.Owner.Name;
                            row.linkName = '/'+row.Id;
                        }
                    }
                    cmp.set('v.data', rows);
                }
            });
            $A.enqueueAction(action);
        }
    },
    
     handleSaveEdition: function (cmp, event, helper) {
        var updatedRecords = cmp.find( "acctTable" ).get( "v.draftValues" );  
        console.log('updatedRecords:', JSON.stringify(updatedRecords));
        var action = cmp.get( "c.updateAccts" );  
        action.setParams({  
            'updatedAccountList' : updatedRecords    
        });  
        action.setCallback( this, function( response ) {  
            var state = response.getState();   
            if ( state === "SUCCESS" ) {  
                if ( response.getReturnValue() === true ) {   
                    helper.toastMsg( 'success', 'Records Saved Successfully.' );  
                    cmp.find( "acctTable" ).set( "v.draftValues", null );   
                } else {    
                    helper.toastMsg( 'error', 'Something went wrong. Contact your system administrator.' );    
                }  
                  
            } else {    
                helper.toastMsg( 'error', 'Something went wrong. Contact your system administrator.' );   
            }  
        });  
        $A.enqueueAction( action ); 
    }
})