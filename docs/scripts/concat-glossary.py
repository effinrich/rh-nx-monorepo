# This program prepares the glossary for publication.
# It concatenates glossary entries and manages cross references.

import os
import sys

if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} <base-path> <output-file>")
    sys.exit(1)

# base path to glossary
basepath = sys.argv[1] 

#glossary file
glossary = sys.argv[2]


# Function to build link for see and see also references.
def build_link(myString):
   temp_text = myString.title()
   for i in temp_text:
     temp_text = temp_text.replace("-"," ")
   temp_text = "[" + temp_text.strip() + "]"
   temp_link = "(#"+ref_link.strip()+")."
   return temp_text + temp_link.lower()
    

# Put heading information for Glossary
with open(glossary,"w") as glossaryFile:
    glossaryFile.write("# Glossary\n\n")

# sets the directory list
for dir_name in sorted(os.listdir(basepath)):
    dir_path = os.path.join(basepath, dir_name)
    if not os.path.isdir(dir_path):
        continue
    with open(glossary,"a") as outfile:
        outfile.write("\n\n## "+dir_name.upper()+"\n---\n")
        for file_name in os.listdir(dir_path):
            if not file_name.endswith('.md'):
                continue
            file_path = os.path.join(dir_path, file_name)

            with open(file_path) as infile:
                 ref_type = ' '
                 ref_link = ' '
                 ref_complete = ' ' 
                 end = None
                 for line in infile:
                    if line == "---\n":
                       outfile.write('')
                    # Process See entries
                    elif "see:" in line:
                        ref_type = "*See *"
                        ref_link = line[5:end]
                        ref_complete = ref_type + build_link(ref_link)
                    # Process See also entries
                    elif "see-also:" in line:
                        ref_type = "See also "
                        ref_link =  line[9:end]
                        ref_complete = ref_type + build_link(ref_link)
                    # Process headings to transform to H3    
                    elif "#" in line[0]:
                        outfile.write("##" + line)
                    # Process other lines
                    else:
                        outfile.write(line+"\n")
                 # Print out see and see also if applicable
                 outfile.write("\n" + ref_complete)
                   
            outfile.write("\n")
           
        
           
                  
                    
