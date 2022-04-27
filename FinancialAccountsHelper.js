({
    COLUMNS: [
        {  
   			label: 'Account Name',  fieldName: 'linkName',  type: 'url', sortable: true, editable: true, 
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank'} 
  		}, 
        { label: 'Account Owner', fieldName: 'OwnerName', sortable: true },
        { label: 'Phone', fieldName: 'Phone', editable: true },
        { label: 'Website', fieldName: 'Website', editable: true },
        { label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable: true }
    ],

    setColumns: function(cmp) {
        cmp.set('v.columns', this.COLUMNS);
    },

    setData: function(cmp) {
        var action = cmp.get('c.getFinancialAccounts'); 
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
    },

    sortBy: function(field, reverse, primer) {
        var key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    },

    handleSort: function(cmp, event) {
        var sortedBy = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');

        //var cloneData = this.DATA.slice(0);
        var cloneData = cmp.get('v.data').slice(0);
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
        
        cmp.set('v.data', cloneData);
        cmp.set('v.sortDirection', sortDirection);
        cmp.set('v.sortedBy', sortedBy);
    },
    
    toastMsg : function( strType, strMessage ) {  
        var showToast = $A.get( "e.force:showToast" );   
        showToast.setParams({     
            message : strMessage,  
            type : strType,  
            mode : 'sticky'    
        });   
        showToast.fire();     
    }
})